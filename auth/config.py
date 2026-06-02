from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise Exception("SECRET_KEY is missing in environment variables")

SECRET_KEY = SECRET_KEY.strip()

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30