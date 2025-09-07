from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any
from app.services.database import get_database
from app.services.groq_service import GroqService
import json

router = APIRouter()
groq_service = GroqService()

@router.post("/recommendations/personalized")
async def get_personalized_recommendations(
    payload: Dict[str, Any] = Body(...)
):
    """Get AI-powered personalized recommendations"""
    user_id = payload.get("user_id")
    preferences = payload.get("preferences", {})
    
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    db = get_database()
    
    # Get user data
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's aptitude results
    aptitude_results = []
    if user.get("aptitude_results"):
        cursor = db.aptitude_results.find({"_id": {"$in": user["aptitude_results"]}})
        aptitude_results = await cursor.to_list(length=None)
    
    # Prepare data for AI analysis
    user_profile = {
        "interests": user.get("interests", []),
        "grade": user.get("grade"),
        "aptitude_scores": [],
        "preferences": preferences
    }
    
    for result in aptitude_results:
        user_profile["aptitude_scores"].append({
            "test_type": result["test_type"],
            "score": result["score"],
            "category_scores": result["category_scores"]
        })
    
    # Get AI recommendations
    try:
        ai_response = await groq_service.get_career_recommendations(user_profile)
        recommendations = parse_ai_recommendations(ai_response)
        
        # Get matching courses and colleges from database
        course_matches = await find_matching_courses(db, recommendations.get("courses", []))
        college_matches = await find_matching_colleges(db, recommendations.get("colleges", []))
        
        return {
            "ai_insights": recommendations.get("insights", []),
            "career_paths": recommendations.get("career_paths", []),
            "recommended_courses": course_matches,
            "recommended_colleges": college_matches,
            "next_steps": recommendations.get("next_steps", [])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/chat")
async def ai_chat(
    payload: Dict[str, Any] = Body(...)
):
    """AI-powered career guidance chat"""
    message = payload.get("message")
    user_id = payload.get("user_id")
    context = payload.get("context", {})
    
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    try:
        # Get AI response
        ai_response = await groq_service.get_chat_response(message, context)
        
        return {
            "response": ai_response,
            "suggestions": generate_follow_up_suggestions(message)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/analyze/skills")
async def analyze_skills(
    payload: Dict[str, Any] = Body(...)
):
    """Analyze user skills and suggest improvements"""
    skills = payload.get("skills", [])
    target_career = payload.get("target_career")
    
    if not skills:
        raise HTTPException(status_code=400, detail="Skills list is required")
    
    try:
        analysis = await groq_service.analyze_skills(skills, target_career)
        
        return {
            "skill_gaps": analysis.get("gaps", []),
            "strengths": analysis.get("strengths", []),
            "improvement_suggestions": analysis.get("suggestions", []),
            "recommended_courses": analysis.get("courses", [])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/market/trends")
async def get_market_trends(
    payload: Dict[str, Any] = Body(...)
):
    """Get current job market trends and predictions"""
    field = payload.get("field", "technology")
    location = payload.get("location", "global")
    
    try:
        trends = await groq_service.get_market_trends(field, location)
        
        return {
            "current_trends": trends.get("current", []),
            "emerging_fields": trends.get("emerging", []),
            "salary_insights": trends.get("salary", {}),
            "growth_predictions": trends.get("growth", [])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

async def find_matching_courses(db, course_suggestions: List[str]) -> List[Dict]:
    """Find courses matching AI suggestions"""
    if not course_suggestions:
        return []
    
    # Create search query for course suggestions
    query = {
        "$or": [
            {"title": {"$regex": "|".join(course_suggestions), "$options": "i"}},
            {"category": {"$in": course_suggestions}},
            {"skills": {"$in": course_suggestions}}
        ]
    }
    
    cursor = db.courses.find(query).limit(5)
    courses = await cursor.to_list(length=None)
    
    # Convert ObjectId to string
    for course in courses:
        course["_id"] = str(course["_id"])
    
    return courses

async def find_matching_colleges(db, college_suggestions: List[str]) -> List[Dict]:
    """Find colleges matching AI suggestions"""
    if not college_suggestions:
        return []
    
    # Create search query for college suggestions
    query = {
        "$or": [
            {"courses_offered": {"$in": college_suggestions}},
            {"type": {"$in": college_suggestions}},
            {"name": {"$regex": "|".join(college_suggestions), "$options": "i"}}
        ]
    }
    
    cursor = db.colleges.find(query).limit(5)
    colleges = await cursor.to_list(length=None)
    
    # Convert ObjectId to string
    for college in colleges:
        college["_id"] = str(college["_id"])
    
    return colleges

def parse_ai_recommendations(ai_response: str) -> Dict[str, Any]:
    """Parse AI response into structured recommendations"""
    try:
        # Try to parse as JSON first
        return json.loads(ai_response)
    except json.JSONDecodeError:
        # If not JSON, parse as text and structure it
        lines = ai_response.split('\n')
        
        recommendations = {
            "insights": [],
            "career_paths": [],
            "courses": [],
            "colleges": [],
            "next_steps": []
        }
        
        current_section = "insights"
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if "career path" in line.lower():
                current_section = "career_paths"
            elif "course" in line.lower():
                current_section = "courses"
            elif "college" in line.lower():
                current_section = "colleges"
            elif "next step" in line.lower() or "recommend" in line.lower():
                current_section = "next_steps"
            else:
                recommendations[current_section].append(line)
        
        return recommendations

def generate_follow_up_suggestions(message: str) -> List[str]:
    """Generate follow-up question suggestions"""
    suggestions = []
    
    if "career" in message.lower():
        suggestions.extend([
            "What skills do I need for this career?",
            "What is the salary range for this field?",
            "Which colleges offer relevant programs?"
        ])
    
    if "course" in message.lower():
        suggestions.extend([
            "How long does this course take?",
            "What are the prerequisites?",
            "What career opportunities does this open?"
        ])
    
    if "college" in message.lower():
        suggestions.extend([
            "What are the admission requirements?",
            "What is the placement rate?",
            "What courses are offered?"
        ])
    
    # Default suggestions if none match
    if not suggestions:
        suggestions = [
            "Tell me about trending careers",
            "Help me choose a career path",
            "What skills are in demand?"
        ]
    
    return suggestions[:3]  # Return max 3 suggestions
