import slideData from '../slideData';
import AvatarScene from './Avatar/AvatarScene';
import LipSyncWrapper from './Avatar/motion/LipSyncWrapper';
import ModelController from './Avatar/motion/ModelController';

export default async function handleSendMessage(
  voiceA: string,
  voiceB: string,
  inputValue: string,
  setLipSyncA: React.Dispatch<
    React.SetStateAction<{ json: string; mp3: string } | null>
  >,
  setLipSyncB: React.Dispatch<
    React.SetStateAction<{ json: string; mp3: string } | null>
  >,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  setMessages: React.Dispatch<
    React.SetStateAction<
      {
        speaker: string;
        message: string;
        type: 'user' | 'agentA' | 'agentB';
        timestamp: string;
      }[]
    >
  >
): Promise<void> {
  if (inputValue.trim() === '') return;
  // 1. 사용자 입력 메시지 추가
  setMessages((prev) => [
    ...prev,
    {
      speaker: '사용자',
      message: inputValue,
      type: 'user',
      timestamp: new Date().toLocaleString(),
    },
  ]);

  // 1-1. input값을 공백으로 만듬
  setInputValue('');

  try {
    // 2. 백엔드로 메시지 전송
    const response = await fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userprompt: inputValue }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response from the server');
    }

    const data = await response.json();

    // 백엔드에서 받은 conversation 추가
    type ConversationItem = { speaker: string; message: string };
    const newMessages = data.conversation.map(
      (item: ConversationItem, index: number) => ({
        speaker: item.speaker,
        message: item.message,
        type: index % 2 === 0 ? 'agentA' : 'agentB', // 짝수는 AgentA, 홀수는 AgentB
        timestamp: new Date().toLocaleString(),
      })
    );

    //파라미터 mp3, json을 배열형태
    const toDeleteFiles: { mp3: string; json: string }[] = [];
    //메시지 1개씩 받고 TTS 요청
    for (const msg of newMessages) {
      if (msg.type === 'agentA' || msg.type === 'agentB') {
        // 1. 메시지 표시
        setMessages((prev) => [...prev, msg]);

        // 2. voice 선택
        const voice = msg.type === 'agentA' ? voiceA : voiceB;

        // 3. TTS 요청
        const res = await fetch('http://localhost:8000/tts/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: msg.message,
            voice: voice || 'ko-KR-Wavenet-A',
          }),
        });

        const data = await res.json();
        const filename = data.filename;
        const json = data.json;

        // 삭제할 파일 리스트에 저장
        toDeleteFiles.push({ mp3: filename, json });

        // 4. 립싱크 세팅
        const setLipSync = msg.type === 'agentA' ? setLipSyncA : setLipSyncB;
        setLipSync({ json, mp3: filename });

        // 5. 오디오 재생 완료까지 대기
        await new Promise<void>((resolve) => {
          const audio = new Audio(`http://localhost:8000/tts/${filename}`);
          audio.onended = () => resolve();
          audio.play();
        });
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    }

    // 모든 메시지 처리 완료 후 mp3/json 삭제 요청
    for (const file of toDeleteFiles) {
      await fetch(`http://localhost:8000/tts/${file.mp3}`, {
        method: 'DELETE',
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
