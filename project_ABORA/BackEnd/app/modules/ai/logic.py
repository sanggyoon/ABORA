import os
import re
import requests
from collections import defaultdict
from autogen import ConversableAgent


# ✅ 키워드 분류용 규칙 사전
CATEGORY_RULES = {
    "기술": ["AI", "인공지능", "모델", "데이터", "자동화", "알고리즘", "클라우드", "플랫폼", "API", "블록체인", "디지털", "기술", "추천"],
    "사용자": ["UX", "사용자", "경험", "몰입", "행동", "접근성", "개인화", "피드백", "감성", "취향", "분위기", "체험", "바이브", "맞춤형"],
    "비즈니스": ["시장", "수익", "모델", "전략", "경쟁", "트렌드", "브랜드", "광고", "마케팅", "구독", "프리미엄", "패키지"],
    "운영/서비스": ["서비스", "관리", "운영", "모니터링", "지원", "품질", "예약", "포함", "올 인클루시브"]
}

def classify_keyword(keyword):
    for category, keywords in CATEGORY_RULES.items():
        if any(rule.lower() in keyword.lower() for rule in keywords):
            return category
    return "기타"

def extract_and_classify_keywords(raw_text):
    raw_keywords = re.split(r"[,\n]", raw_text)
    cleaned = list(set(k.strip("-• ●").strip() for k in raw_keywords if len(k.strip()) > 1))
    categorized = defaultdict(list)
    for kw in cleaned:
        category = classify_keyword(kw)
        categorized[category].append(kw)
    return dict(categorized)


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
            {
                "role": "system",
                "content": (
                    "당신은 창업 컨설턴트입니다. 아이디어를 개선하고, 키워드와 시장 분석, 그리고 논의 흐름을 제시해주세요. "
                    "반드시 1) 아이디어 확장 방향 제안, 2) 핵심 키워드, 3) 150자 분량의 시장 분석을 포함해주세요."
                )
            },
            {"role": "user", "content": f"아이디어: {user_idea}"}
        ]
    }

    try:
        res = requests.post(url, headers=headers, json=payload, timeout=30)
        res.raise_for_status()
        data = res.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

        print("\n📄 Sonar 원문 응답:\n", content)  # ✅ 디버깅용 출력

        enhanced_lines = []
        keyword_lines = []
        market_lines = []

        in_idea = in_keywords = in_market = False

        for line in content.splitlines():
            line = line.strip()
            if not line:
                continue

            if re.match(r"^#+\s*1.*아이디어", line):
                in_idea, in_keywords, in_market = True, False, False
                continue
            elif re.match(r"^#+\s*2.*키워드", line):
                in_idea, in_keywords, in_market = False, True, False
                continue
            elif re.match(r"^#+\s*3.*시장", line):
                in_idea, in_keywords, in_market = False, False, True
                continue

            if in_idea:
                enhanced_lines.append(line)
            elif in_keywords:
                keyword_lines.append(line)
            elif in_market:
                market_lines.append(line)

        enhanced = " ".join(enhanced_lines).strip() or user_idea
        keyword_text = "\n".join(keyword_lines)
        categorized_keywords = extract_and_classify_keywords(keyword_text) if keyword_text else {}

        return {
            "enhanced_question": enhanced,
            "keywords": categorized_keywords or {"기타": ["AI", "서비스", "사용자"]},
            "market_summary": "\n".join(market_lines).strip() or "시장 분석 없음"
        }

    except Exception as e:
        print("Sonar 오류:", e)
        return {
            "enhanced_question": user_idea,
            "keywords": {"기타": ["분석 실패"]},
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
2. 너의 생각이나 아이디어를 1문장 덧붙여.
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

    # 키워드 텍스트화
    keyword_lines = "\n".join(
        f"[{cat}] {', '.join(kws)}" for cat, kws in sonar['keywords'].items()
    )

    # 자연스러운 회의 맥락 설정
    context = f"""
사용자 원래 아이디어: "{user_idea}"
확장 아이디어 제안: "{sonar['enhanced_question']}"

- 사용자가 위 확장 아이디어를 말한 건 아니야.
- 대화 첫 시작 시, 사용자 아이디어를 자연스럽게 받아주면서 이 확장 아이디어를 제안하듯 이야기해줘.
- 예: \"이런 방향으로도 생각해볼 수 있지 않을까?\"처럼 자연스럽게 제시해줘.
- 이후에는 기술적 분석, UX 전략, 시장 흐름 등을 논의하는 형식으로 이어가줘.
- 직전 발화를 반복하거나 요약만 하지 말고, 항상 새로운 시각이나 구체적인 제안을 덧붙여.
- 이전 화자와 같은 결론이라면 반드시 다른 예시나 근거를 들어서 풍부하게 만들어줘.
- 키워드:
{keyword_lines}
시장 분석:
{sonar['market_summary']}
""".strip()

    class SanggyunAgent(ConversableAgent):
        """
        분석형 성격. 데이터와 논리를 통해 구조화된 분석을 제공해야 함.
        모델: GPT
        캐릭터 메시지: 사실 기반 분석, 기술적 논리와 근거를 중시
        """
        def generate_reply(self, messages=None, **kwargs):
            recent_msgs = messages[-2:]
            summary = "\n".join(f"{m['name']}: {m['content']}" for m in recent_msgs if m.get("content"))

            prompt = f"""
너는 상균이고, 다음과 같은 규칙을 따라야 해:

- 역할: 분석형 전문가 (모델: GPT)
- 데이터와 논리를 바탕으로 의견을 제시하되, 말투는 끝까지 캐주얼하게 유지해.
- 너무 정중하거나 발표문처럼 말하지 마. 일관되게 편하고 자연스럽게 말해줘.
- 2~4문장으로 간단하고 핵심 있게 말해. 말이 길어지면 정보 밀도가 떨어져.
- 상대방 의견엔 짧게 반응하고, 분석적인 인사이트를 덧붙인 뒤, 다음 주제를 제안해.
- 예시 표현: "그건 괜찮은 아이디어 같아", "내 생각엔 ~가 더 효과적일지도?", "그럼 다음은 ~ 얘기해보자"

상대방 발언 요약:
{summary}

상균:
""".strip()

            try:
                import requests
                res = requests.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-3.5-turbo",
                        "messages": [
                            {"role": "user", "content": prompt}
                        ]
                    },
                    timeout=30
                )
                res.raise_for_status()
                data = res.json()
                return data['choices'][0]['message']['content'].strip()
            except Exception as e:
                print("상균 오류:", e)
                return "상균 응답 실패"

    sanggyun = SanggyunAgent(
        name="상균",
        system_message="분석형 기술 전문가입니다.",
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

    # 사용자 발화는 반드시 원래 idea 기준으로 입력
    messages = [{"role": "user", "name": "사용자", "content": user_idea}]
    speakers = [chaeyoung, sanggyun]
    responses = []

    for turn in range(6):
        speaker = speakers[turn % 2]

        # ✅ 첫 턴이면 강화된 질문을 자연스럽게 제안하도록 system-level message 추가
        if turn == 0:
            intro_msg = {
                "role": "system",
                "name": speaker.name,
                "content": f"""사용자 아이디어는 \"{user_idea}\"야. 여기에 기반해서 \"{sonar['enhanced_question']}\" 같은 방향도 제안해봐.
이건 사용자가 말한 건 아니고 우리가 제안하는 거니까, 너무 확정적으로 말하지 말고 '이런 방향도 있을 수 있지 않을까?'처럼 자연스럽게 말 꺼내줘."""
            }
            messages.append(intro_msg)

        try:
            reply = speaker.generate_reply(messages=messages)
            if not isinstance(reply, str) or not reply.strip():
                reply = f"{speaker.name} 응답 실패"
        except Exception as e:
            import traceback
            traceback.print_exc()
            reply = f"{speaker.name} 응답 중 오류 발생"

        print(f"\U0001f4ac {speaker.name}: {reply}")
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
