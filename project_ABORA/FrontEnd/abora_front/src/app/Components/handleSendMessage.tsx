export default async function handleSendMessage(
    inputValue: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    setUserMessages: React.Dispatch<React.SetStateAction<{ message: string; timestamp: string }[]>>
): Promise<void> {
    if (inputValue.trim() !== '') {
        const timestamp = new Date().toLocaleString();
        const text = inputValue;
        setUserMessages((prev) => [...prev, { message: inputValue, timestamp }]);
        setInputValue('');

        // ✅ 1. TTS API 호출
        await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        // ✅ 2. Whisper 분석된 타이밍 JSON 불러오기
        //const res = await fetch('/tts/tts_output.json');
        //const segments = await res.json();

        // ✅ 4. mp3 재생 & 립싱크 실행
        const audio = new Audio(`/tts/tts_output.mp3?ts=${Date.now()}`);
        // audio.onplay = () => {
        //     const startTime = Date.now();
        // };
        audio.play();
    }
}