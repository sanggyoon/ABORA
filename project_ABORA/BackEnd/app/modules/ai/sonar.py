
import os
import re
import requests
from collections import defaultdict


os.environ['PERPLEXITY_API_KEY'] = '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'
# ✅ 확장된 키워드 분류 규칙
CATEGORY_RULES = {
    "기술": [
        "AI", "인공지능", "모델", "데이터", "자동화", "알고리즘",
        "클라우드", "플랫폼", "API", "블록체인", "디지털", "기술", "추천"
    ],
    "사용자": [
        "UX", "사용자", "경험", "몰입", "행동", "접근성", "개인화",
        "감성", "취향", "분위기", "체험", "바이브", "맞춤형"
    ],
    "비즈니스": [
        "시장", "수익", "모델", "전략", "경쟁", "트렌드", "브랜드",
        "광고", "마케팅", "구독", "프리미엄", "패키지"
    ],
    "운영/서비스": [
        "서비스", "운영", "지원", "모니터링", "고객", "품질",
        "예약", "관리", "포함", "올 인클루시브"
    ]
}

def classify_keyword(keyword):
    for category, keywords in CATEGORY_RULES.items():
        if any(rule.lower() in keyword.lower() for rule in keywords):
            return category
    return "기타"

def extract_and_classify_keywords(raw_text):
    # 키워드 여러 줄에서 추출
    raw_keywords = re.split(r"[,\n]", raw_text)
    cleaned = list(set(k.strip("-• ●").strip() for k in raw_keywords if len(k.strip()) > 1))
    categorized = defaultdict(list)
    for kw in cleaned:
        category = classify_keyword(kw)
        categorized[category].append(kw)
    return dict(categorized)


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

        # 섹션 감지 플래그
        in_idea = in_keywords = in_market = False

        for line in content.splitlines():
            line = line.strip()
            if not line:
                continue

            # 섹션 헤더 감지
            if re.match(r"^#+\s*1.*아이디어", line):
                in_idea, in_keywords, in_market = True, False, False
                continue
            elif re.match(r"^#+\s*2.*키워드", line):
                in_idea, in_keywords, in_market = False, True, False
                continue
            elif re.match(r"^#+\s*3.*시장", line):
                in_idea, in_keywords, in_market = False, False, True
                continue

            # 섹션별 텍스트 누적
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



# ✅ 메인 실행
if __name__ == "__main__":
    user_idea = input("아이디어를 입력하세요: ")

    result = enrich_question_with_sonar(user_idea)

    print("\n✅ [강화된 질문]")
    print(result['enhanced_question'])

    print("\n✅ [카테고리별 키워드]")
    for cat, kws in result['keywords'].items():
        print(f"  [{cat}] → {', '.join(kws)}")

    print("\n✅ [시장 분석 요약]")
    print(result['market_summary'])
