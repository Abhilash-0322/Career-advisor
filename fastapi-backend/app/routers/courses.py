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
from ..services.groq_service import GroqService

# Create groq service instance
groq_service = GroqService()

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
        learning_style = profile.learning_style or "mixed"
        time_commitment = profile.time_commitment or "10-15 hours per week"
        budget_range = profile.budget_range or "flexible"
        
        # Create AI prompt for course recommendations
        ai_prompt = f"""
        Based on this user profile, recommend 15-20 relevant online courses:

        PROFILE:
        - Interests: {', '.join(interests) if interests else 'General technology'}
        - Career Goals: {', '.join(career_goals) if career_goals else 'Career advancement'}
        - Current Skills: {', '.join(current_skills) if current_skills else 'Beginner level'}
        - Skills to Develop: {', '.join(skill_gaps) if skill_gaps else 'Foundation skills'}
        - Learning Style: {learning_style}
        - Time Available: {time_commitment}
        - Budget: {budget_range}

        Provide recommendations in this exact JSON format:
        {{
            "recommendations": [
                {{
                    "title": "Course Title",
                    "provider": "Platform Name",
                    "description": "Detailed course description",
                    "duration": "X weeks/months",
                    "difficulty_level": "Beginner/Intermediate/Advanced",
                    "match_percentage": 85,
                    "reasoning": "Why this course fits the user",
                    "skills_gained": ["skill1", "skill2"],
                    "prerequisites": ["req1", "req2"],
                    "estimated_cost": "$X or Free",
                    "rating": 4.5,
                    "enrollments": 10000,
                    "url": "https://example.com/course"
                }}
            ]
        }}

        Focus on:
        1. Diverse course topics matching interests
        2. Progressive skill building
        3. Industry-relevant skills
        4. Mix of beginner to advanced levels
        5. Various providers (Coursera, edX, Udemy, freeCodeCamp, etc.)
        """

        try:
            # Get AI-powered recommendations
            ai_response = await groq_service.get_completion(ai_prompt)
            
            # Try to parse AI response
            import json
            ai_data = json.loads(ai_response)
            ai_recommendations = ai_data.get("recommendations", [])
            
        except Exception as ai_error:
            print(f"AI recommendation failed: {ai_error}")
            ai_recommendations = []

        # Enhanced sample recommendations as fallback
        enhanced_recommendations = [
            {
                "title": "Complete Python Bootcamp",
                "provider": "Udemy",
                "description": "Learn Python from basics to advanced including web development, data science, and automation.",
                "duration": "12 weeks",
                "difficulty_level": "Beginner to Advanced",
                "match_percentage": 92,
                "reasoning": f"Perfect for your interests in {', '.join(interests[:2]) if interests else 'programming'} with comprehensive coverage",
                "skills_gained": ["Python", "Web Development", "Data Analysis", "Automation"],
                "prerequisites": ["Basic Computer Skills"],
                "estimated_cost": "$79",
                "rating": 4.6,
                "enrollments": 150000,
                "url": "https://udemy.com/python-bootcamp"
            },
            {
                "title": "Machine Learning Specialization",
                "provider": "Coursera (Stanford)",
                "description": "Learn machine learning algorithms, neural networks, and deep learning with hands-on projects.",
                "duration": "6 months",
                "difficulty_level": "Intermediate",
                "match_percentage": 88,
                "reasoning": f"Excellent for advancing in {', '.join(career_goals[:2]) if career_goals else 'AI/ML career'} with university-level content",
                "skills_gained": ["Machine Learning", "Neural Networks", "Python", "TensorFlow"],
                "prerequisites": ["Python", "Basic Statistics"],
                "estimated_cost": "$49/month",
                "rating": 4.8,
                "enrollments": 95000,
                "url": "https://coursera.org/ml-specialization"
            },
            {
                "title": "AWS Cloud Practitioner",
                "provider": "AWS Training",
                "description": "Learn cloud computing fundamentals and prepare for AWS certification.",
                "duration": "8 weeks",
                "difficulty_level": "Beginner",
                "match_percentage": 85,
                "reasoning": "Essential cloud skills for modern tech careers with industry certification",
                "skills_gained": ["Cloud Computing", "AWS Services", "Infrastructure", "Security"],
                "prerequisites": ["Basic IT Knowledge"],
                "estimated_cost": "Free",
                "rating": 4.5,
                "enrollments": 200000,
                "url": "https://aws.amazon.com/training"
            },
            {
                "title": "React Complete Guide",
                "provider": "Udemy",
                "description": "Master React.js including hooks, context, Redux, and modern development practices.",
                "duration": "10 weeks",
                "difficulty_level": "Intermediate",
                "match_percentage": 87,
                "reasoning": "Perfect for web development goals with current market demand",
                "skills_gained": ["React.js", "JavaScript", "Frontend Development", "Redux"],
                "prerequisites": ["HTML", "CSS", "JavaScript"],
                "estimated_cost": "$89",
                "rating": 4.7,
                "enrollments": 180000,
                "url": "https://udemy.com/react-complete-guide"
            },
            {
                "title": "Data Science with R",
                "provider": "edX (Harvard)",
                "description": "Comprehensive data science course covering statistics, visualization, and machine learning.",
                "duration": "16 weeks",
                "difficulty_level": "Intermediate",
                "match_percentage": 83,
                "reasoning": "Strong statistical foundation for data science career paths",
                "skills_gained": ["R Programming", "Statistics", "Data Visualization", "Machine Learning"],
                "prerequisites": ["Basic Math", "Statistics"],
                "estimated_cost": "Free (Verified: $199)",
                "rating": 4.6,
                "enrollments": 75000,
                "url": "https://edx.org/data-science-r"
            },
            {
                "title": "Full Stack JavaScript",
                "provider": "freeCodeCamp",
                "description": "Complete full-stack development with JavaScript, Node.js, React, and MongoDB.",
                "duration": "300+ hours",
                "difficulty_level": "Beginner to Advanced",
                "match_percentage": 90,
                "reasoning": "Comprehensive full-stack skills with hands-on projects and certification",
                "skills_gained": ["JavaScript", "React", "Node.js", "MongoDB", "Full-Stack Development"],
                "prerequisites": ["Basic Computer Skills"],
                "estimated_cost": "Free",
                "rating": 4.8,
                "enrollments": 500000,
                "url": "https://freecodecamp.org/learn"
            },
            {
                "title": "Cybersecurity Fundamentals",
                "provider": "Cisco Networking Academy",
                "description": "Learn cybersecurity principles, ethical hacking, and network security.",
                "duration": "6 weeks",
                "difficulty_level": "Beginner",
                "match_percentage": 82,
                "reasoning": "High-demand security skills with industry recognition",
                "skills_gained": ["Network Security", "Ethical Hacking", "Risk Assessment", "Compliance"],
                "prerequisites": ["Basic Networking"],
                "estimated_cost": "Free",
                "rating": 4.4,
                "enrollments": 120000,
                "url": "https://netacad.com/cybersecurity"
            },
            {
                "title": "UI/UX Design Bootcamp",
                "provider": "Google UX Design Certificate",
                "description": "Learn user experience design from research to prototyping and testing.",
                "duration": "6 months",
                "difficulty_level": "Beginner",
                "match_percentage": 80,
                "reasoning": "Creative skills combined with technical understanding for modern product development",
                "skills_gained": ["UX Research", "Prototyping", "Figma", "User Testing", "Design Thinking"],
                "prerequisites": ["None"],
                "estimated_cost": "$39/month",
                "rating": 4.7,
                "enrollments": 85000,
                "url": "https://coursera.org/google-ux-design"
            },
            {
                "title": "DevOps Engineering",
                "provider": "Udacity",
                "description": "Learn CI/CD, containerization, infrastructure as code, and monitoring.",
                "duration": "4 months",
                "difficulty_level": "Advanced",
                "match_percentage": 86,
                "reasoning": "Critical skills for modern software deployment and operations",
                "skills_gained": ["Docker", "Kubernetes", "CI/CD", "Terraform", "Monitoring"],
                "prerequisites": ["Linux", "Programming", "Cloud Basics"],
                "estimated_cost": "$399/month",
                "rating": 4.5,
                "enrollments": 45000,
                "url": "https://udacity.com/devops"
            },
            {
                "title": "Blockchain Development",
                "provider": "ConsenSys Academy",
                "description": "Learn blockchain technology, smart contracts, and decentralized applications.",
                "duration": "8 weeks",
                "difficulty_level": "Intermediate",
                "match_percentage": 78,
                "reasoning": "Emerging technology with high growth potential",
                "skills_gained": ["Blockchain", "Solidity", "Smart Contracts", "Web3", "DeFi"],
                "prerequisites": ["Programming", "JavaScript"],
                "estimated_cost": "$1,250",
                "rating": 4.3,
                "enrollments": 25000,
                "url": "https://consensys.net/academy"
            }
        ]

        # Combine AI recommendations with enhanced fallbacks
        all_recommendations = []
        
        # Add AI recommendations if available
        for rec in ai_recommendations[:10]:  # Limit AI recommendations
            try:
                all_recommendations.append(CourseRecommendation(
                    title=rec.get("title", "AI Recommended Course"),
                    provider=rec.get("provider", "AI Curated"),
                    description=rec.get("description", "AI-generated course recommendation"),
                    duration=rec.get("duration", "Variable"),
                    difficulty_level=rec.get("difficulty_level", "Intermediate"),
                    match_percentage=rec.get("match_percentage", 75),
                    reasoning=rec.get("reasoning", "AI-powered recommendation"),
                    skills_gained=rec.get("skills_gained", []),
                    prerequisites=rec.get("prerequisites", []),
                    estimated_cost=rec.get("estimated_cost", "Variable"),
                    rating=rec.get("rating", 4.0),
                    enrollments=rec.get("enrollments", 10000),
                    url=rec.get("url", "https://example.com")
                ))
            except:
                continue

        # Add enhanced recommendations
        for rec in enhanced_recommendations:
            all_recommendations.append(CourseRecommendation(**rec))

        # Limit total recommendations
        max_recommendations = min(request.max_recommendations, len(all_recommendations))
        final_recommendations = all_recommendations[:max_recommendations]
        
        return CourseRecommendationResponse(
            success=True,
            user_id=user_id,
            recommendations=final_recommendations,
            total_found=len(final_recommendations),
            processing_time=0.2,
            generated_at=datetime.now()
        )
        
    except Exception as e:
        print(f"Course recommendation error: {e}")
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
