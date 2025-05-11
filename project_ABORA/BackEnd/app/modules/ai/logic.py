import os
import requests
from autogen import ConversableAgent

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
            {"role": "system", "content": "당신은 창업 컨설턴트입니다. 아이디어를 개선하고, 키워드와 시장 분석, 그리고 논의 흐름을 제시해주세요. 반드시 1) 아이디어 확장 방향 제안, 2) 핵심 키워드, 3) 150자 분량의 시장 분석을 포함해주세요."},
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
                keywords = [k.strip("-\u2022 ") for k in raw.split(",") if k.strip()]
            elif "아이디어" in line and ":" in line:
                enhanced = line.split(":", 1)[1].strip()
            elif any(k in line.lower() for k in ["시장", "트렌드", "경쟁"]):
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

            prompt = f"""
아래는 사용자 아이디어에 대한 창의적인 회의입니다.
너는 {self.name}이고, 다음과 같은 방식으로 회의에 참여해.

1. 상대방 말에 1문장으로 반응해.
2. 너의 생각이나 아이디어를 2~3문장 덧붙여.
3. 마지막에는 질문하거나 다음 논의 주제를 제안해.

말투는 친구나 동료처럼 자연스럽게, 발표문처럼 말하지 마.

상대방 발언 요약:
{summary}

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


# ✅ 실행 함수
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
        name="상균",
        system_message=f"""분석형 기술 전문가입니다.
{context}
- 기술 구현 가능성, 경쟁 분석, 비용 예측, 사용자 중심 설계를 고려해서 조언해줘.
- 말투는 자연스럽고 편안하게, 동료랑 이야기하듯 가볍게.
- 마지막 발화일 경우엔 아이디어 확장을 위한 창의적인 제안 하나를 던져줘.
- 문장은 너무 형식적으로 쓰지 말고, 대화하듯 짧고 캐주얼하게 말해줘.
""",
        llm_config={"config_list": [{"model": "gpt-3.5-turbo", "api_key": os.environ["OPENAI_API_KEY"]}]},
        human_input_mode="NEVER"
    )

    chaeyoung = build_gemini_agent(
        name="채영",
        system_message=f"""직관형 전략가입니다.
{context}
- UX 전략, 수익화 가능성, 감성적인 사용자 경험을 고려해서 조언해줘.
- 말투는 따뜻하고 현실적인 조언 중심으로. 친구에게 말하듯 부드럽게 이야기해줘.
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
