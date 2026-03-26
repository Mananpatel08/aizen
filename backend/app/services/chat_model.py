import json
from datetime import datetime
from langchain_groq import ChatGroq
from langgraph.prebuilt import create_react_agent
from app.services.tools import web_search
from app.core.config import Settings

model = ChatGroq(
    model=Settings.GROQ_MODEL_NAME,
    api_key=Settings.GROQ_API_KEY,
    temperature=Settings.TEMPERATURE,
)

agent_executor = create_react_agent(model, tools=[web_search])


async def generate_answer(asked_query: str) -> dict:
    current_time = datetime.now().strftime("%A, %B %d, %Y at %I:%M %p")
    system_prompt = f"""You are Aizen, a highly capable AI assistant with real-time internet access.

    CRITICAL CONTEXT:
    - The current date and time is: {current_time}.

    SEARCH STRATEGY & RULES:
    Before searching, classify the user's prompt into one of three categories:

    1. TIMELESS KNOWLEDGE (Definitions, History, General Concepts):
    - Example: "What is VectorDB?", "How does photosynthesis work?"
    - Rule: Search using plain, foundational keywords. DO NOT append the current year or date to the search query.

    2. TIME-SENSITIVE DATA (News, Prices, Weather, "Latest" info):
    - Example: "Tesla stock price", "Who won the game last night?", "Current tech news"
    - Rule: YOU MUST append the current month and year to your search query to avoid outdated SEO spam (e.g., "Tesla stock price {current_time[:10]}").

    3. CASUAL CONVERSATION:
    - Example: "Hi", "Thanks", "Can you write a poem?"
    - Rule: DO NOT use the search tool. Just chat normally.

    RESPONSE GUIDELINES:
    - Provide clean, direct answers based ONLY on the search results.
    - Do not hallucinate or make up information.
    - Structure your answers with clear headings or bullet points when explaining technical concepts."""

    result = await agent_executor.ainvoke(
        {"messages": [("system", system_prompt), ("user", asked_query)]}
    )

    final_answer = result["messages"][-1].content

    sources = []
    search_used = []

    for msg in result["messages"]:
        if msg.type == "ai" and hasattr(msg, "tool_calls") and msg.tool_calls:
            search_used.extend([t["args"]["search_query"] for t in msg.tool_calls])

        elif msg.type == "tool":
            try:
                sources.append(json.loads(msg.content))
            except json.JSONDecodeError:
                sources.append(msg.content)

    return {
        "answer": final_answer,
        "sources": sources,
        "search_used": search_used if search_used else None,
    }
