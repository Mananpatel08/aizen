from langchain_community.tools import DuckDuckGoSearchResults
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.tools import tool
from app.core.config import Settings

tavily_search = TavilySearchResults(
    max_results=3, tavily_api_key=Settings.TAVILY_API_KEY
)
duck_search = DuckDuckGoSearchResults(num_results=3, output_format="list")


@tool
def web_search(search_query: str) -> str:
    """
    Searches the web for external knowledge.

    CRITICAL INSTRUCTION FOR search_query GENERATION:
    - If the user asks for a definition, concept, or historical fact, keep the query general (e.g., "Vector Database architecture").
    - If the user asks for live prices, news, or current events, append the current month and year to the query.
    """
    return tavily_search.invoke({"query": search_query})
    # return duck_search.invoke({"query": search_query})       #Use DuckDuckGo if Tavlly is down or rate-limited.
