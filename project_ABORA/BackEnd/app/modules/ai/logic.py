# app/modules/ai/logic.py

import os
import requests
from autogen import ConversableAgent, GroupChat, GroupChatManager

# ✅ Sonar 기반 질문 강화 및 시장 분석
def enrich_question_with_sonar(user_idea):
    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.environ['PERPLEXITY_API_KEY']}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "sonar",
        "messages": [
            {"role": "system", "content": "당신은 창업 컨설턴트입니다. 아이디어를 개선하고, 키워드와 시장 분석을 제공해주세요."},
            {"role": "user", "content": f"아이디어: {user_idea}"}
        ]
    }

    try:
        res = requests.post(url, headers=headers, json=payload, timeout=30)
        res.raise_for_status()
        data = res.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

        enhanced = user_idea
        keywords = []
        market_lines = []

        for line in content.splitlines():
            if "키워드" in line and ":" in line:
                raw = line.split(":", 1)[1]
                keywords = [k.strip("-• ") for k in raw.split(",") if k.strip()]
            elif "아이디어" in line and ":" in line:
                enhanced = line.split(":", 1)[1].strip()
            elif any(k in line.lower() for k in ["시장", "성장", "트렌드", "경쟁", "니즈"]):
                market_lines.append(line.strip())

        return {
            "enhanced_question": enhanced or user_idea,
            "keywords": keywords or ["AI", "서비스", "사용자"],
            "market_summary": "\n".join(market_lines) or "시장 분석 없음"
        }

    except Exception as e:
        print("Sonar 오류:", e)
        return {
            "enhanced_question": user_idea,
            "keywords": ["분석 실패"],
            "market_summary": "시장 분석 실패"
        }


def build_gemini_agent(name, system_message):
    class GeminiAgent(ConversableAgent):
        def generate_reply(self, messages=None, **kwargs):
            recent_msgs = messages[-2:]
            summary = "\n".join(f"{m['name']}: {m['content']}" for m in recent_msgs if m.get("content"))

            phase = "검증" if len(messages) < 3 else "확장"
            prompt = f"""
[{phase} 단계]

상대방의 발언 요약:
{summary}

너는 {self.name}이고, 아래와 같은 방식으로 대답해.
1. 먼저 상대방 말에 1문장으로 반응해.
2. 이어서 너의 의견을 2~3문장으로 덧붙여.
3. 반드시 주제를 유지하고 논리적으로 대화해줘.

{self.name}:
""".strip()

            try:
                res = requests.post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
                    params={"key": os.environ["GEMINI_API_KEY"]},
                    json={"contents": [{"role": "user", "parts": [{"text": prompt}]}]},
                    timeout=30
                )
                res.raise_for_status()
                candidates = res.json().get("candidates", [])
                parts = candidates[0].get("content", {}).get("parts", []) if candidates else []
                return parts[0].get("text", "Gemini 응답 없음.").strip() if parts else "Gemini 응답 없음."
            except Exception as e:
                print("Gemini 오류:", e)
                return "Gemini 응답 실패."

    return GeminiAgent(name=name, system_message=system_message)


def run_structured_chat(user_idea, db=None, question_id=None):
    from app.modules.ai.agents import ConversableAgent

    sonar = enrich_question_with_sonar(user_idea)
    context = f"""
아이디어 강화: {sonar['enhanced_question']}
키워드: {', '.join(sonar['keywords'])}
시장 분석:
{sonar['market_summary']}
""".strip()

    sanggyun = ConversableAgent(
        name="Sanggyun",
        system_message=f"""분석형 기술 전문가입니다.
{context}
다음 항목을 반드시 고려해:
- 기술 난이도
- 경쟁 분석
- 비용 예측
- 사용자 중심 설계
말투는 공감하면서도 현실적이고 조언 중심이어야 합니다.
""",
        llm_config={"config_list": [{"model": "gpt-3.5-turbo", "api_key": os.environ["OPENAI_API_KEY"]}]},
        human_input_mode="NEVER"
    )

    chaeyoung = build_gemini_agent(
        name="Chaeyoung",
        system_message=f"""직관형 전략가입니다.
{context}
다음 항목을 반드시 고려해:
- UX/서비스 전략
- 수익화 및 지속 가능성
- 사례 기반 아이디어 확장
말투는 다정하고 현실적인 제안 중심으로 해줘.
"""
    )

    messages = [{"role": "user", "name": "사용자", "content": sonar['enhanced_question']}]
    speakers = [chaeyoung, sanggyun]

    responses = []

    for turn in range(6):
        speaker = speakers[turn % 2]
        reply = speaker.generate_reply(messages=messages)
        messages.append({"role": "assistant", "name": speaker.name, "content": reply})
        responses.append({"speaker": speaker.name, "message": reply})

        # ✅ DB에 AI 응답 저장
        if db and question_id:
            try:
                from app.modules.answer.schemas import AnswerCreate
                from app.modules.answer.crud import create_answer

                create_answer(db, AnswerCreate(
                    question_id=question_id,
                    speaker=speaker.name,
                    content=reply
                ))
            except Exception as e:
                import traceback
                traceback.print_exc()

    return {
        "enhanced_question": sonar['enhanced_question'],
        "keywords": sonar['keywords'],
        "market_summary": sonar['market_summary'],
        "conversation": responses
    }