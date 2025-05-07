# app/modules/ai/agents.py

import os
from autogen import ConversableAgent
from dotenv import load_dotenv

load_dotenv()

# 환경 변수에서 API 키 불러오기
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY")
os.environ["PERPLEXITY_API_KEY"] = os.getenv("PERPLEXITY_API_KEY")

# 에이전트 정의
openai_agent = ConversableAgent(name="GPT", system_message="분석적이고 균형 잡힌 시각으로 사용자 질문에 답변해주세요.")
gemini_agent = ConversableAgent(name="Gemini", system_message="감성적이고 직관적으로 사용자 질문에 반응해주세요.")