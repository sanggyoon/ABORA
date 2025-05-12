# transcribe_mp3.py
from faster_whisper import WhisperModel
import json

# 1. 모델 로딩 (base / small)
model = WhisperModel("base", device="cpu", compute_type="int8")

# 2. MP3 분석 시작
segments, info = model.transcribe("C:/projects/abora/project_ABORA/FrontEnd/abora_front/public/tts/tts_output.mp3", language="ko")

# 3. 결과를 리스트로 변환
results = []
for segment in segments:
    results.append({
        "start": segment.start,
        "end": segment.end,
        "text": segment.text
    })

# 4. JSON 저장
with open("C:/projects/abora/project_ABORA/FrontEnd/abora_front/public/tts/tts_output.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)


print("분석 완료! tts_output.json 생성됨")
