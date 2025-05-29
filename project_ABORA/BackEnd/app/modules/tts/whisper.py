import torch
import torchaudio
import whisper
from silero_vad import VoiceActivityDetector

def analyze_audio_with_vad_and_whisper(mp3_path):
    # 1. 오디오 로드
    wav, sr = torchaudio.load(mp3_path)
    vad = VoiceActivityDetector(sample_rate=sr)

    # 2. 음성 구간 추출
    speech_timestamps = vad.detect_speech(wav)

    # 3. Whisper 로드
    model = whisper.load_model("base")

    results = []
    for segment in speech_timestamps:
        start = segment['start']
        end = segment['end']
        sliced_audio = wav[:, int(start * sr):int(end * sr)]
        torchaudio.save("temp_segment.wav", sliced_audio, sr)

        result = model.transcribe("temp_segment.wav", language="ko")
        results.append({
            "start": round(start, 2),
            "end": round(end, 2),
            "text": result['text']
        })

    return results
