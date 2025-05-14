
import os
import base64
import requests
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import uuid


load_dotenv()

#mp3 파일명을 메시지마다 고유하게 설정

router = APIRouter(prefix="/tts", tags=["TTS"])
GOOGLE_TTS_API_KEY = os.getenv("GOOGLE_TTS_API_KEY")

@router.post("/speak")
async def speak(request: Request):
    body = await request.json()
    text = body.get("text", "")
    voice = body.get("voice", "ko-KR-Wavenet-A") #프론트에서 전달받음

    if not text:
        return { "error": "Text is empty." }

    url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={GOOGLE_TTS_API_KEY}"
    payload = {
        "input": { "text": text },
        "voice": { "languageCode": "ko-KR", "name": voice },
        "audioConfig": { "audioEncoding": "MP3" }
    }

    res = requests.post(url, headers={"Content-Type": "application/json"}, json=payload)
    if res.status_code != 200:
        return { "error": "TTS request failed." }

    audio_base64 = res.json()["audioContent"]
    audio_bytes = base64.b64decode(audio_base64)

    filename = f"tts_{uuid.uuid4().hex}.mp3"
    filepath = f"public/tts/{filename}"



    with open(filepath, "wb") as f:
        f.write(audio_bytes)



    return JSONResponse({ "filename": filename })
