# database.py
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI")  # your Atlas connection string
client = AsyncIOMotorClient(MONGO_URI)
db = client["snappatch"]
