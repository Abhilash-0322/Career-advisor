from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.services.database import get_database
from app.models.schemas import Course
from app.services.groq_service import GroqService
import json

router = APIRouter()
groq_service = GroqService()

class CourseRecommendationRequest(BaseModel):
    user_profile: Dict[str, Any]
    preferences: Optional[Dict[str, Any]] = {}
    max_recommendations: int = 10

class UserProfileForRecommendations(BaseModel):
    academic_background: Optional[Dict[str, Any]] = {}
    career_goals: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    current_skills: Optional[List[str]] = []
    skill_gaps: Optional[List[str]] = []
    learning_style: Optional[str] = ""
    difficulty_preference: Optional[str] = "beginner"

@router.get("/", response_model=List[Course])
async def get_courses(
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """Get courses with optional filtering"""
    db = get_database()
    
    # Build query
    query = {}
    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    if difficulty:
        query["difficulty"] = {"$regex": difficulty, "$options": "i"}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"skills": {"$in": [{"$regex": search, "$options": "i"}]}}
        ]
    
    # Execute query
    cursor = db.courses.find(query).skip(skip).limit(limit)
    courses = await cursor.to_list(length=None)
    
    # Convert ObjectId to string
    for course in courses:
        course["_id"] = str(course["_id"])
    
    return courses

@router.get("/{course_id}", response_model=Course)
async def get_course(course_id: str):
    """Get a specific course by ID"""
    db = get_database()
    
    course = await db.courses.find_one({"_id": course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course["_id"] = str(course["_id"])
    return course

@router.get("/categories/list")
async def get_categories():
    """Get all unique course categories"""
    db = get_database()
    
    categories = await db.courses.distinct("category")
    return {"categories": categories}

@router.get("/recommendations/{user_id}")
async def get_course_recommendations(user_id: str, limit: int = Query(10, ge=1, le=50)):
    """Get personalized course recommendations for a user"""
    db = get_database()
    
    # Get user preferences and aptitude results
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's interests and recent aptitude results
    interests = user.get("interests", [])
    aptitude_results = user.get("aptitude_results", [])
    
    # Build recommendation query based on interests
    query = {}
    if interests:
        query["$or"] = [
            {"category": {"$in": interests}},
            {"skills": {"$in": interests}},
            {"career_paths": {"$in": interests}}
        ]
    
    # Get recommended courses
    cursor = db.courses.find(query).limit(limit)
    courses = await cursor.to_list(length=None)
    
    # Convert ObjectId to string
    for course in courses:
        course["_id"] = str(course["_id"])
    
    return {"recommendations": courses, "based_on": interests}

@router.post("/recommendations")
async def get_ai_course_recommendations(request: CourseRecommendationRequest):
    """Get AI-powered course recommendations based on user profile"""
    try:
        # Extract user profile data
        profile = request.user_profile
        user_id = profile.user_id
        interests = profile.interests or []
        career_goals = profile.career_goals or []
        current_skills = profile.current_skills or []
        skill_gaps = profile.skill_gaps or []
        
        # Create sample course data for demonstration
        sample_courses = [
            {
                "title": "Introduction to Python Programming",
                "provider": "TechEd Online",
                "description": "Learn Python fundamentals including variables, functions, loops, and data structures.",
                "duration": "6 weeks",
                "difficulty_level": "Beginner",
                "skills_gained": ["Python", "Programming Basics", "Problem Solving"],
                "prerequisites": ["Basic Computer Skills"],
                "estimated_cost": "$49",
                "rating": 4.5,
                "url": "https://example.com/python-course"
            },
            {
                "title": "Data Science with Python",
                "provider": "DataLearn Academy", 
                "description": "Comprehensive course covering pandas, numpy, matplotlib, and machine learning basics.",
                "duration": "10 weeks",
                "difficulty_level": "Intermediate",
                "skills_gained": ["Data Analysis", "Python", "Machine Learning", "Statistics"],
                "prerequisites": ["Python Basics"],
                "estimated_cost": "$129",
                "rating": 4.7,
                "url": "https://example.com/data-science-course"
            },
            {
                "title": "Web Development Bootcamp",
                "provider": "WebDev Institute",
                "description": "Full-stack web development with HTML, CSS, JavaScript, React, and Node.js.",
                "duration": "12 weeks", 
                "difficulty_level": "Intermediate",
                "skills_gained": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
                "prerequisites": ["Basic Programming Knowledge"],
                "estimated_cost": "$199",
                "rating": 4.6,
                "url": "https://example.com/webdev-course"
            }
        ]
        
        # Simple matching logic for now
        recommendations = []
        for i, course in enumerate(sample_courses[:request.max_recommendations]):
            match_percentage = 80 - (i * 5)  # Simple scoring
            
            recommendation = CourseRecommendation(
                title=course["title"],
                provider=course["provider"],
                description=course["description"],
                duration=course["duration"],
                difficulty_level=course["difficulty_level"],
                match_percentage=match_percentage,
                reasoning=f"Matches your interests in {', '.join(interests[:2])} and helps with skill development",
                skills_gained=course["skills_gained"],
                prerequisites=course["prerequisites"],
                estimated_cost=course["estimated_cost"],
                rating=course["rating"],
                url=course["url"]
            )
            recommendations.append(recommendation)
        
        return CourseRecommendationResponse(
            success=True,
            user_id=user_id,
            recommendations=recommendations,
            total_found=len(recommendations),
            processing_time=0.1,
            generated_at=datetime.now()
        )
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to generate recommendations: {str(e)}",
            "user_id": getattr(request.user_profile, 'user_id', 'unknown'),
            "recommendations": [],
            "total_found": 0
        }
        Based on this user profile, recommend the most suitable courses from the available options:

        USER PROFILE:
        - Education Level: {academic.get('educationLevel', 'Not specified')}
        - Career Stage: {career.get('careerStage', 'Not specified')}
        - Career Goals: {career.get('goals', [])}
        - Interested Industries: {career.get('interestedIndustries', [])}
        - Current Technical Skills: {skills.get('technicalSkills', [])}
        - Skills to Develop: {skills.get('skillGaps', [])}
        - Interests: {interests}

        AVAILABLE COURSES:
        {json.dumps([{
            'id': str(course['_id']),
            'title': course.get('title', ''),
            'category': course.get('category', ''),
            'level': course.get('level', ''),
            'duration': course.get('duration', ''),
            'skills': course.get('skills', []),
            'description': course.get('description', '')[:200]
        } for course in all_courses[:50]], indent=2)}

        Please provide a JSON response with the following structure:
        {{
            "recommendations": [
                {{
                    "course_id": "course_id_here",
                    "title": "Course Title",
                    "recommendation_reason": "Why this course is recommended for this user",
                    "confidence_score": 0.85,
                    "skill_alignment": ["matching skills"],
                    "career_relevance": "How this helps their career goals"
                }}
            ]
        }}

        Recommend up to {request.max_recommendations} courses that best match the user's profile.
        Focus on courses that align with their career goals, fill their skill gaps, and match their interests.
        """

        # Get AI recommendations
        ai_response = await groq_service.get_completion(ai_prompt)
        
        try:
            ai_recommendations = json.loads(ai_response)
        except json.JSONDecodeError:
            # Fallback to basic filtering if AI response is not valid JSON
            ai_recommendations = {
                "recommendations": []
            }
        
        # Get full course details for recommended courses
        recommended_courses = []
        for rec in ai_recommendations.get("recommendations", []):
            course_id = rec.get("course_id")
            if course_id:
                # Find the course in our database
                course = next((c for c in all_courses if str(c['_id']) == course_id), None)
                if course:
                    course["_id"] = str(course["_id"])
                    course["isAIRecommended"] = True
                    course["aiRecommendationReason"] = rec.get("recommendation_reason", "")
                    course["aiConfidenceScore"] = rec.get("confidence_score", 0.8)
                    recommended_courses.append(course)
        
        # If AI didn't provide good recommendations, fall back to interest-based filtering
        if len(recommended_courses) < 3:
            fallback_courses = []
            user_interests = interests + career.get("interestedIndustries", []) + skills.get("skillGaps", [])
            
            for course in all_courses:
                if len(fallback_courses) >= request.max_recommendations:
                    break
                    
                # Check if course matches user interests
                course_keywords = (course.get("category", "") + " " + 
                                 " ".join(course.get("skills", [])) + " " + 
                                 course.get("title", "")).lower()
                
                for interest in user_interests:
                    if interest.lower() in course_keywords:
                        course["_id"] = str(course["_id"])
                        course["isAIRecommended"] = True
                        course["aiRecommendationReason"] = f"Matches your interest in {interest}"
                        course["aiConfidenceScore"] = 0.7
                        fallback_courses.append(course)
                        break
            
            # Add fallback courses if we don't have enough recommendations
            for course in fallback_courses:
                if len(recommended_courses) >= request.max_recommendations:
                    break
                if course not in recommended_courses:
                    recommended_courses.append(course)
        
        return {
            "success": True,
            "recommendations": recommended_courses,
            "total_count": len(recommended_courses),
            "ai_powered": len(ai_recommendations.get("recommendations", [])) > 0
        }
        
    except Exception as e:
        # Return fallback recommendations on error
        db = get_database()
        fallback_courses = await db.courses.find({}).limit(5).to_list(length=None)
        
        for course in fallback_courses:
            course["_id"] = str(course["_id"])
            course["isAIRecommended"] = True
            course["aiRecommendationReason"] = "General recommendation"
            course["aiConfidenceScore"] = 0.5
            
        return {
            "success": True,
            "recommendations": fallback_courses,
            "total_count": len(fallback_courses),
            "ai_powered": False,
            "fallback_reason": "AI service unavailable"
        }
