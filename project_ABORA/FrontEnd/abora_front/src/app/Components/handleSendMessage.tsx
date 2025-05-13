export default async function handleSendMessage(
  inputValue: string,
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
  if (inputValue.trim() !== "") {
    const text = inputValue;

    // 사용자 메시지 추가
    setMessages((prev) => [
      ...prev,
      {
        speaker: "사용자",
        message: text,
        type: "user",
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setInputValue("");

    try {
      // 백엔드로 메시지 전송
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userprompt: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the server");
      }

      const data = await response.json();

      // 백엔드에서 받은 conversation 추가
      const newMessages = data.conversation.map((item: any, index: number) => ({
        speaker: item.speaker,
        message: item.message,
        type: index % 2 === 0 ? "agentA" : "agentB", // 짝수는 AgentA, 홀수는 AgentB
        timestamp: new Date().toLocaleString(),
      }));

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (error) {
      console.error("Error:", error);
    }

    // ✅ 1. TTS API 호출
    await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    // 2. Whisper 분석된 타이밍 JSON 불러오기
    //const res = await fetch('/tts/tts_output.json');
    //const segments = await res.json();

    // 4. mp3 재생 & 립싱크 실행
    const audio = new Audio(`/tts/tts_output.mp3?ts=${Date.now()}`);
    // audio.onplay = () => {
    //     const startTime = Date.now();
    // };
    audio.play();
  }
}
