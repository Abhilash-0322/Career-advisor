from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import Optional

# MongoDB connection
class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

db = Database()

async def connect_to_mongo():
    """Create database connection"""
    db.client = AsyncIOMotorClient(
        os.getenv("MONGODB_URI", "mongodb+srv://mauryaabhi2003_db_user:qUFJmxBkFyFHtpjd@cluster0.0zjwxwq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    )
    db.database = db.client.career_advisor
    print("Connected to MongoDB")

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")

def get_database():
    """Get database instance"""
    return db.database
