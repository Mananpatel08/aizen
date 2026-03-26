import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL_NAME = os.getenv("GROQ_MODEL_NAME")
    TEMPERATURE = float(os.getenv("TEMPERATURE"))
    

settings = Settings()