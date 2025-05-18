import slideData from "../slideData";
import AvatarScene from "./Avatar/AvatarScene";
import LipSyncWrapper from "./Avatar/motion/LipSyncWrapper";
import ModelController from "./Avatar/motion/ModelController";

export default async function handleSendMessage(
    voiceA: string,
    voiceB: string,
    inputValue: string,
    setLipSyncA:React.Dispatch<React.SetStateAction<{ json: string, mp3: string } | null>>,
    setLipSyncB:React.Dispatch<React.SetStateAction<{ json: string, mp3: string } | null>>,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    setMessages: React.Dispatch<
        React.SetStateAction<
            {
                speaker: string;
                message: string;
                type: "user" | "agentA" | "agentB";
                timestamp: string;
            }[]
        >
    >,
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
        const newMessages = data.conversation.map((item: any, index: number) => ({
            speaker: item.speaker,
            message: item.message,
            type: index % 2 === 0 ? 'agentA' : 'agentB', // 짝수는 AgentA, 홀수는 AgentB
            timestamp: new Date().toLocaleString(),
        }));


        //const playedFiles: string[] = []; //재생된 파일 이름들을 따로 저장
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
                    body: JSON.stringify({ text: msg.message, voice: voice || 'ko-KR-Wavenet-A' })
                });

                const data = await res.json();
                const filename = data.filename;
                const json = data.json;

                // 4. 립싱크 json/mp3 세팅
                const setLipSync = msg.type === 'agentA' ? setLipSyncA : setLipSyncB;
                setLipSync({ json, mp3: filename });

                // 5. 음성 재생 완료까지 대기 (Promise로 감싼 다음 실행)
                await new Promise<void>((resolve) => {
                    const audio = new Audio(`http://localhost:8000/tts/${filename}`);
                    audio.onended = resolve;
                    audio.play();//play가 중첩
                });

            } else {
                setMessages((prev) => [...prev, msg]);
            }
        }


    } catch (error) {
        console.error('Error:', error);
    }

}
