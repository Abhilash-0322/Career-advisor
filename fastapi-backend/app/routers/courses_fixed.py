from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import json
from datetime import datetime

from ..models.schemas import (
    Course, 
    CourseRecommendationRequest, 
    CourseRecommendation,
    CourseRecommendationResponse,
    UserProfileForRecommendations
)
from ..services.database import get_database
from ..services.groq_service import groq_service

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "courses"}

@router.get("/")
async def get_courses(
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """Get courses with optional filtering"""
    # Return sample courses for now
    sample_courses = [
        {
            "_id": "course_1",
            "title": "Introduction to Python Programming",
            "description": "Learn Python fundamentals including variables, functions, loops, and data structures.",
            "category": "Programming",
            "duration": "6 weeks",
            "level": "Beginner",
            "prerequisites": ["Basic Computer Skills"],
            "skills": ["Python", "Programming Basics", "Problem Solving"],
            "rating": 4.5,
            "enrollmentCount": 15000
        },
        {
            "_id": "course_2", 
            "title": "Data Science with Python",
            "description": "Comprehensive course covering pandas, numpy, matplotlib, and machine learning basics.",
            "category": "Data Science",
            "duration": "10 weeks",
            "level": "Intermediate",
            "prerequisites": ["Python Basics", "Basic Statistics"],
            "skills": ["Data Analysis", "Python", "Machine Learning", "Statistics"],
            "rating": 4.7,
            "enrollmentCount": 8500
        },
        {
            "_id": "course_3",
            "title": "Web Development Bootcamp",
            "description": "Full-stack web development with HTML, CSS, JavaScript, React, and Node.js.",
            "category": "Web Development",
            "duration": "12 weeks",
            "level": "Intermediate", 
            "prerequisites": ["Basic Programming Knowledge"],
            "skills": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
            "rating": 4.6,
            "enrollmentCount": 12000
        }
    ]
    
    # Apply filters
    filtered_courses = sample_courses
    
    if category and category != 'all':
        filtered_courses = [c for c in filtered_courses if category.lower() in c['category'].lower()]
    
    if search:
        filtered_courses = [c for c in filtered_courses if 
                          search.lower() in c['title'].lower() or 
                          search.lower() in c['description'].lower()]
    
    # Apply pagination
    paginated_courses = filtered_courses[skip:skip + limit]
    
    return paginated_courses

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
        
        # Create sample course recommendations
        sample_recommendations = [
            CourseRecommendation(
                title="Introduction to Python Programming",
                provider="TechEd Online",
                description="Learn Python fundamentals including variables, functions, loops, and data structures. Perfect for beginners.",
                duration="6 weeks",
                difficulty_level="Beginner",
                match_percentage=85,
                reasoning=f"Perfect match for your interests in {', '.join(interests[:2]) if interests else 'programming'} and helps build foundational skills",
                skills_gained=["Python", "Programming Basics", "Problem Solving", "Debugging"],
                prerequisites=["Basic Computer Skills"],
                estimated_cost="$49",
                rating=4.5,
                enrollments=15000,
                url="https://example.com/python-course"
            ),
            CourseRecommendation(
                title="Data Science with Python",
                provider="DataLearn Academy",
                description="Comprehensive course covering pandas, numpy, matplotlib, and machine learning basics.",
                duration="10 weeks", 
                difficulty_level="Intermediate",
                match_percentage=78,
                reasoning=f"Great for advancing your skills and addressing gaps in {', '.join(skill_gaps[:2]) if skill_gaps else 'data analysis'}",
                skills_gained=["Data Analysis", "Python", "Machine Learning", "Statistics", "Visualization"],
                prerequisites=["Python Basics", "Basic Statistics"],
                estimated_cost="$129",
                rating=4.7,
                enrollments=8500,
                url="https://example.com/data-science-course"
            ),
            CourseRecommendation(
                title="Web Development Bootcamp", 
                provider="WebDev Institute",
                description="Full-stack web development with HTML, CSS, JavaScript, React, and Node.js.",
                duration="12 weeks",
                difficulty_level="Intermediate",
                match_percentage=72,
                reasoning=f"Excellent for career goals in {', '.join(career_goals[:2]) if career_goals else 'software development'} with hands-on projects",
                skills_gained=["HTML", "CSS", "JavaScript", "React", "Node.js", "Full-Stack Development"],
                prerequisites=["Basic Programming Knowledge"],
                estimated_cost="$199",
                rating=4.6,
                enrollments=12000,
                url="https://example.com/webdev-course"
            )
        ]
        
        # Limit recommendations based on request
        max_recommendations = min(request.max_recommendations, len(sample_recommendations))
        final_recommendations = sample_recommendations[:max_recommendations]
        
        return CourseRecommendationResponse(
            success=True,
            user_id=user_id,
            recommendations=final_recommendations,
            total_found=len(final_recommendations),
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

@router.get("/categories/list")
async def get_categories():
    """Get all unique course categories"""
    categories = [
        "Programming",
        "Data Science", 
        "Web Development",
        "Machine Learning",
        "Cloud Computing",
        "Mobile Development",
        "DevOps",
        "Cybersecurity"
    ]
    return {"categories": categories}
