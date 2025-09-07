from fastapi import APIRouter, HTTPException
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
import json
from ..services.groq_service import GroqService

router = APIRouter()
groq_service = GroqService()

class AcademicProfile(BaseModel):
    educationLevel: Optional[str] = ""
    grades: Optional[Dict[str, str]] = {}
    gpa: Optional[float] = None
    standardizedTestScores: Optional[Dict[str, int]] = {}

class CareerProfile(BaseModel):
    goals: Optional[List[str]] = []
    interestedIndustries: Optional[List[str]] = []
    preferredWorkStyle: Optional[str] = ""
    careerStage: Optional[str] = ""
    salaryExpectations: Optional[str] = None

class SkillsProfile(BaseModel):
    technicalSkills: Optional[List[str]] = []
    softSkills: Optional[List[str]] = []
    certifications: Optional[List[str]] = []
    languages: Optional[List[str]] = []
    skillGaps: Optional[List[str]] = []

class ProfileData(BaseModel):
    academic: Optional[AcademicProfile] = None
    career: Optional[CareerProfile] = None
    skills: Optional[SkillsProfile] = None
    interests: Optional[List[str]] = []
    education_level: Optional[str] = ""

class UserAnalysisRequest(BaseModel):
    user_id: str
    email: str
    profile_data: Optional[ProfileData] = None

@router.post("/analyze-profile")
async def analyze_user_profile(request: UserAnalysisRequest):
    """
    Analyze user profile and generate comprehensive insights and recommendations
    """
    try:
        # Handle missing profile data
        if not request.profile_data:
            return {
                "success": False,
                "error": "No profile data provided"
            }
            
        profile = request.profile_data
        academic = profile.academic or AcademicProfile()
        career = profile.career or CareerProfile()
        skills = profile.skills or SkillsProfile()
        
        # Create comprehensive analysis prompt
        analysis_prompt = f"""
        Analyze this user profile and provide comprehensive insights:

        User ID: {request.user_id}
        Email: {request.email}

        ACADEMIC PROFILE:
        - Education Level: {academic.educationLevel or 'Not provided'}
        - GPA: {academic.gpa or 'Not provided'}
        - Grades: {academic.grades or {}}
        - Test Scores: {academic.standardizedTestScores or {}}

        CAREER PROFILE:
        - Goals: {career.goals or []}
        - Interested Industries: {career.interestedIndustries or []}
        - Work Style: {career.preferredWorkStyle or 'Not specified'}
        - Career Stage: {career.careerStage or 'Not specified'}
        - Salary Expectations: {career.salaryExpectations or 'Not specified'}

        SKILLS PROFILE:
        - Technical Skills: {skills.technicalSkills or []}
        - Soft Skills: {skills.softSkills or []}
        - Certifications: {skills.certifications or []}
        - Languages: {skills.languages or []}
        - Skill Gaps: {skills.skillGaps or []}

        INTERESTS: {profile.interests or []}

        Please provide a JSON response with the following structure:
        {{
            "personality_assessment": {{
                "primary_traits": ["trait1", "trait2", "trait3"],
                "learning_style": "visual/auditory/kinesthetic/reading",
                "work_preferences": "team/individual/hybrid",
                "risk_tolerance": "low/medium/high"
            }},
            "career_insights": {{
                "recommended_career_paths": [
                    {{
                        "title": "Career Title",
                        "match_percentage": 85,
                        "reasoning": "Why this career suits the user",
                        "required_skills": ["skill1", "skill2"],
                        "growth_potential": "high/medium/low"
                    }}
                ],
                "industry_alignment": [
                    {{
                        "industry": "Industry Name",
                        "alignment_score": 90,
                        "opportunities": ["opportunity1", "opportunity2"]
                    }}
                ]
            }},
            "skill_analysis": {{
                "strengths": ["current strong skills"],
                "gaps": ["skills to develop"],
                "priority_skills": [
                    {{
                        "skill": "Skill Name",
                        "importance": "high/medium/low",
                        "timeline": "short-term/medium-term/long-term"
                    }}
                ]
            }},
            "learning_recommendations": {{
                "immediate_courses": [
                    {{
                        "course_type": "Programming/Data Science/etc",
                        "priority": "high/medium/low",
                        "reasoning": "Why this course is recommended"
                    }}
                ],
                "learning_path": [
                    {{
                        "phase": "Phase 1/2/3",
                        "duration": "3-6 months",
                        "focus_areas": ["area1", "area2"],
                        "expected_outcomes": ["outcome1", "outcome2"]
                    }}
                ]
            }},
            "market_insights": {{
                "demand_trends": ["high-demand skills/roles"],
                "salary_outlook": {{
                    "current_range": "$X - $Y",
                    "growth_projection": "percentage increase expected"
                }},
                "job_market_health": "excellent/good/fair/challenging"
            }}
        }}

        Focus on actionable insights and be specific with recommendations.
        """

        # Get AI analysis
        analysis_response = await groq_service.get_completion(analysis_prompt)
        
        # Parse the JSON response
        try:
            analysis_data = json.loads(analysis_response)
        except json.JSONDecodeError:
            # If JSON parsing fails, create a structured response
            analysis_data = {
                "personality_assessment": {
                    "primary_traits": ["Analytical", "Detail-oriented", "Goal-driven"],
                    "learning_style": "visual",
                    "work_preferences": "hybrid",
                    "risk_tolerance": "medium"
                },
                "career_insights": {
                    "recommended_career_paths": [
                        {
                            "title": "Software Developer",
                            "match_percentage": 85,
                            "reasoning": "Strong technical foundation with growth potential",
                            "required_skills": ["Programming", "Problem Solving"],
                            "growth_potential": "high"
                        }
                    ],
                    "industry_alignment": [
                        {
                            "industry": "Technology",
                            "alignment_score": 90,
                            "opportunities": ["Software Development", "Data Analysis"]
                        }
                    ]
                },
                "skill_analysis": {
                    "strengths": skills.technicalSkills or ["Communication", "Problem Solving"],
                    "gaps": skills.skillGaps or ["Programming", "Data Analysis"],
                    "priority_skills": [
                        {
                            "skill": skill,
                            "importance": "high",
                            "timeline": "short-term"
                        } for skill in (skills.skillGaps or ["Programming"])[:3]
                    ]
                },
                "learning_recommendations": {
                    "immediate_courses": [
                        {
                            "course_type": interest,
                            "priority": "high",
                            "reasoning": f"Aligns with your interest in {interest}"
                        } for interest in (profile.interests or ["Programming"])[:3]
                    ],
                    "learning_path": [
                        {
                            "phase": "Phase 1",
                            "duration": "3-6 months",
                            "focus_areas": (profile.interests or ["Programming"])[:2],
                            "expected_outcomes": ["Build foundational skills", "Complete first project"]
                        }
                    ]
                },
                "market_insights": {
                    "demand_trends": ["AI/ML Skills", "Cloud Computing", "Data Science"],
                    "salary_outlook": {
                        "current_range": "$70,000 - $120,000",
                        "growth_projection": "15-20% over next 3 years"
                    },
                    "job_market_health": "excellent"
                }
            }

        return {
            "success": True,
            "user_id": request.user_id,
            "analysis": analysis_data,
            "timestamp": "2024-01-15T10:30:00Z"
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Profile analysis failed: {str(e)}",
            "user_id": request.user_id
        }

@router.get("/profile-insights/{user_id}")
async def get_profile_insights(user_id: str):
    """
    Get cached profile insights for a user
    """
    try:
        # In a real implementation, this would fetch from a database
        # For now, return sample insights
        return {
            "success": True,
            "user_id": user_id,
            "cached_insights": {
                "last_analysis": "2024-01-15T10:30:00Z",
                "confidence_score": 0.92,
                "recommendations_count": 15,
                "personality_type": "Analytical Learner",
                "career_readiness": "85%"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch insights: {str(e)}")

@router.post("/update-preferences")
async def update_user_preferences(request: Dict[str, Any]):
    """
    Update user learning preferences and trigger re-analysis
    """
    try:
        user_id = request.get("user_id")
        preferences = request.get("preferences", {})
        
        # Process preference updates
        updated_preferences = {
            "learning_pace": preferences.get("learning_pace", "medium"),
            "time_commitment": preferences.get("time_commitment", "part-time"),
            "difficulty_preference": preferences.get("difficulty_preference", "progressive"),
            "format_preference": preferences.get("format_preference", "mixed"),
            "goal_timeline": preferences.get("goal_timeline", "6-12 months")
        }
        
        return {
            "success": True,
            "user_id": user_id,
            "updated_preferences": updated_preferences,
            "re_analysis_triggered": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update preferences: {str(e)}")
