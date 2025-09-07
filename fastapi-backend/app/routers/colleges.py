from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.database import get_database
from app.models.schemas import College

router = APIRouter()

@router.get("/", response_model=List[College])
async def get_colleges(
    location: Optional[str] = Query(None, description="Filter by location"),
    type: Optional[str] = Query(None, description="Filter by type (Government/Private/Deemed)"),
    course: Optional[str] = Query(None, description="Filter by course offered"),
    search: Optional[str] = Query(None, description="Search in name and location"),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """Get colleges with optional filtering"""
    db = get_database()
    
    # Build query
    query = {}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if type:
        query["type"] = {"$regex": type, "$options": "i"}
    if course:
        query["courses_offered"] = {"$in": [{"$regex": course, "$options": "i"}]}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}}
        ]
    
    # Execute query with sorting by ranking (ascending, nulls last)
    cursor = db.colleges.find(query).sort([
        ("ranking", 1)  # Lower ranking number = better rank
    ]).skip(skip).limit(limit)
    
    colleges = await cursor.to_list(length=None)
    
    # Convert ObjectId to string
    for college in colleges:
        college["_id"] = str(college["_id"])
    
    return colleges

@router.get("/{college_id}", response_model=College)
async def get_college(college_id: str):
    """Get a specific college by ID"""
    db = get_database()
    
    college = await db.colleges.find_one({"_id": college_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    college["_id"] = str(college["_id"])
    return college

@router.get("/locations/list")
async def get_locations():
    """Get all unique college locations"""
    db = get_database()
    
    locations = await db.colleges.distinct("location")
    return {"locations": sorted(locations)}

@router.get("/types/list")
async def get_college_types():
    """Get all unique college types"""
    db = get_database()
    
    types = await db.colleges.distinct("type")
    return {"types": types}

@router.get("/courses/offered")
async def get_offered_courses():
    """Get all unique courses offered by colleges"""
    db = get_database()
    
    # Get all courses from all colleges and flatten the list
    pipeline = [
        {"$unwind": "$courses_offered"},
        {"$group": {"_id": "$courses_offered"}},
        {"$sort": {"_id": 1}}
    ]
    
    result = await db.colleges.aggregate(pipeline).to_list(length=None)
    courses = [item["_id"] for item in result]
    
    return {"courses": courses}

@router.get("/recommendations/{user_id}")
async def get_college_recommendations(user_id: str, limit: int = Query(10, ge=1, le=50)):
    """Get personalized college recommendations for a user"""
    db = get_database()
    
    # Get user preferences
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    interests = user.get("interests", [])
    
    # Build recommendation query
    query = {}
    if interests:
        query["courses_offered"] = {"$in": interests}
    
    # Get recommended colleges sorted by rating and ranking
    cursor = db.colleges.find(query).sort([
        ("rating", -1),  # Higher rating first
        ("ranking", 1)   # Lower ranking number (better rank) first
    ]).limit(limit)
    
    colleges = await cursor.to_list(length=None)
    
    # Convert ObjectId to string
    for college in colleges:
        college["_id"] = str(college["_id"])
    
    return {"recommendations": colleges, "based_on": interests}
