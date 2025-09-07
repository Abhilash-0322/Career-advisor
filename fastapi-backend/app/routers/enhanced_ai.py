"""
Enhanced AI Recommendations Router with Agentic AI Integration
"""

from fastapi import APIRouter, HTTPException, Body, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.services.database import get_database
from app.services.ai_agent import agent_orchestrator, UserProfile
from app.services.web_scraper import data_aggregator
import json
from datetime import datetime

router = APIRouter()

class PersonalizedRecommendationRequest(BaseModel):
    user_id: str
    interests: List[str] = []
    career_goals: List[str] = []
    location: Dict[str, str] = {}
    preferences: Dict[str, Any] = {}

class SkillAnalysisRequest(BaseModel):
    user_id: str
    current_skills: List[str] = []
    target_career: str
    experience_level: str = "beginner"

class MarketInsightRequest(BaseModel):
    field: str
    location: Optional[str] = None
    experience_level: str = "entry"

@router.post("/recommendations/comprehensive")
async def get_comprehensive_recommendations(request: PersonalizedRecommendationRequest):
    """Get comprehensive AI-powered recommendations using multiple agents"""
    
    try:
        db = get_database()
        
        # Get user data from database
        user = await db.users.find_one({"_id": request.user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get user's aptitude results
        aptitude_scores = {}
        if user.get("aptitude_results"):
            cursor = db.aptitude_results.find({"user_id": request.user_id})
            results = await cursor.to_list(length=None)
            
            for result in results:
                test_type = result.get("test_type", "general")
                aptitude_scores[test_type] = result.get("score", 0)
        
        # Create user profile for AI agents
        user_profile = UserProfile(
            user_id=request.user_id,
            age=user.get("age", 18),
            grade=user.get("grade", "12th"),
            interests=request.interests or user.get("interests", []),
            aptitude_scores=aptitude_scores,
            academic_performance=user.get("academic_performance", {}),
            location=request.location or user.get("location", {}),
            career_goals=request.career_goals or user.get("career_goals", []),
            personality_traits=user.get("personality_traits", {})
        )
        
        # Get comprehensive guidance from AI agents
        guidance = await agent_orchestrator.get_comprehensive_guidance(user_profile)
        
        # Enhance with real-time market data
        market_insights = {}
        for career_path in guidance.get("consolidated_recommendations", {}).get("career_paths", []):
            if isinstance(career_path, dict) and "field" in career_path:
                field = career_path["field"]
                location = request.location.get("state", "India")
                insights = await data_aggregator.get_market_insights(field, location)
                market_insights[field] = insights
        
        return {
            "user_id": request.user_id,
            "timestamp": datetime.now().isoformat(),
            "ai_guidance": guidance,
            "market_insights": market_insights,
            "personalization_score": guidance.get("confidence_score", 0.8),
            "recommendations_count": len(guidance.get("consolidated_recommendations", {})),
            "data_sources": ["ai_agents", "market_data", "database"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.post("/analysis/skills")
async def analyze_skills_and_gaps(request: SkillAnalysisRequest):
    """Analyze user skills and identify gaps for target career"""
    
    try:
        # Get market requirements for target career
        market_data = await data_aggregator.get_market_insights(request.target_career)
        required_skills = market_data.get("market_data", {}).get("required_skills", [])
        
        # Analyze skill gaps
        current_skills_set = set(skill.lower() for skill in request.current_skills)
        required_skills_set = set(skill.lower() for skill in required_skills)
        
        skill_gaps = list(required_skills_set - current_skills_set)
        matching_skills = list(required_skills_set & current_skills_set)
        
        # Calculate skill match percentage
        match_percentage = len(matching_skills) / len(required_skills_set) * 100 if required_skills_set else 0
        
        # Generate learning recommendations
        learning_plan = await _generate_learning_plan(skill_gaps, request.target_career, request.experience_level)
        
        return {
            "user_id": request.user_id,
            "target_career": request.target_career,
            "analysis": {
                "skill_match_percentage": round(match_percentage, 2),
                "matching_skills": matching_skills,
                "skill_gaps": skill_gaps,
                "priority_skills": skill_gaps[:5],  # Top 5 priority skills
                "market_demand": market_data.get("market_data", {}).get("job_openings", 0)
            },
            "learning_plan": learning_plan,
            "career_outlook": {
                "average_salary": market_data.get("market_data", {}).get("average_salary", "Not available"),
                "growth_rate": market_data.get("market_data", {}).get("growth_rate", "Not available"),
                "top_companies": market_data.get("market_data", {}).get("top_companies", [])
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing skills: {str(e)}")

@router.get("/insights/market")
async def get_market_insights(
    field: str = Query(..., description="Career field to analyze"),
    location: str = Query(None, description="Location for market analysis"),
    include_government_jobs: bool = Query(True, description="Include government job opportunities"),
    include_scholarships: bool = Query(True, description="Include scholarship information")
):
    """Get comprehensive market insights for a specific field"""
    
    try:
        # Get market insights from web scraping
        market_data = await data_aggregator.get_market_insights(field, location)
        
        # Get additional data if requested
        additional_data = {}
        
        if include_scholarships:
            async with data_aggregator.scraper:
                scholarship_data = await data_aggregator.scraper.scrape_scholarship_data(field, location)
                additional_data["scholarships"] = [data.content for data in scholarship_data]
        
        return {
            "field": field,
            "location": location,
            "market_overview": market_data,
            "additional_opportunities": additional_data,
            "analysis_timestamp": datetime.now().isoformat(),
            "data_freshness": "real-time",
            "recommendations": await _generate_market_recommendations(market_data, field)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting market insights: {str(e)}")

@router.get("/timeline/academic")
async def get_academic_timeline(
    grade: str = Query(..., description="Current grade/class"),
    target_field: str = Query(None, description="Target career field"),
    state: str = Query(None, description="State for location-specific timelines")
):
    """Get personalized academic timeline with important deadlines"""
    
    try:
        # Get timeline data from web scraping
        timeline_data = await data_aggregator.get_timeline_data()
        
        # Generate personalized timeline based on grade and target field
        personalized_timeline = await _generate_personalized_timeline(grade, target_field, state)
        
        return {
            "current_grade": grade,
            "target_field": target_field,
            "location": state,
            "personalized_timeline": personalized_timeline,
            "upcoming_deadlines": timeline_data.get("upcoming_events", []),
            "important_dates": timeline_data.get("deadlines", []),
            "preparation_schedule": await _generate_preparation_schedule(grade, target_field),
            "last_updated": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating timeline: {str(e)}")

@router.post("/chat/intelligent")
async def intelligent_career_chat(
    message: str = Body(..., embed=True),
    user_id: str = Body(..., embed=True),
    context: Dict[str, Any] = Body(default={}, embed=True)
):
    """Intelligent career guidance chat with context awareness"""
    
    try:
        db = get_database()
        
        # Get user context
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Enhance context with user data
        enhanced_context = {
            **context,
            "user_interests": user.get("interests", []),
            "user_grade": user.get("grade", ""),
            "user_location": user.get("location", {}),
            "conversation_history": context.get("history", [])
        }
        
        # Use AI agent for intelligent response
        response = await agent_orchestrator.groq_service.get_completion(
            prompt=message,
            system_prompt=f"""
            You are an intelligent career guidance counselor. Use the following context to provide personalized advice:
            
            User Context: {json.dumps(enhanced_context, indent=2)}
            
            Provide helpful, actionable career guidance. Be empathetic and understanding.
            If asked about specific colleges, courses, or career paths, provide detailed information.
            Always encourage the student and provide hope and motivation.
            """,
            temperature=0.7
        )
        
        # Generate follow-up suggestions
        follow_ups = await _generate_follow_up_suggestions(message, enhanced_context)
        
        return {
            "response": response,
            "follow_up_suggestions": follow_ups,
            "user_id": user_id,
            "timestamp": datetime.now().isoformat(),
            "context_used": bool(enhanced_context)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")

@router.get("/colleges/enhanced/{college_name}")
async def get_enhanced_college_info(
    college_name: str,
    state: str = Query(None, description="State of the college")
):
    """Get enhanced college information with real-time data"""
    
    try:
        # Get college data from database
        db = get_database()
        college = await db.colleges.find_one({"name": {"$regex": college_name, "$options": "i"}})
        
        # Get additional data from web scraping
        scraped_data = await data_aggregator.get_comprehensive_college_data(college_name, state)
        
        # Combine database and scraped data
        enhanced_info = {
            "database_info": college,
            "real_time_data": scraped_data,
            "analysis": {
                "data_completeness": _calculate_data_completeness(college, scraped_data),
                "last_updated": datetime.now().isoformat(),
                "reliability_score": _calculate_reliability_score(scraped_data)
            }
        }
        
        return enhanced_info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting college info: {str(e)}")

# Helper functions

async def _generate_learning_plan(skill_gaps: List[str], target_career: str, experience_level: str) -> Dict[str, Any]:
    """Generate a personalized learning plan for skill gaps"""
    
    learning_plan = {
        "immediate_actions": [],
        "short_term_goals": [],
        "long_term_goals": [],
        "resources": [],
        "timeline": "3-6 months for immediate skills, 6-12 months for comprehensive development"
    }
    
    # Prioritize skills based on market demand and difficulty
    priority_skills = skill_gaps[:3]  # Top 3 skills to focus on
    
    for skill in priority_skills:
        learning_plan["immediate_actions"].append(f"Start learning {skill}")
        learning_plan["resources"].append({
            "skill": skill,
            "platform": "Coursera/Udemy",
            "estimated_time": "2-4 weeks",
            "difficulty": "beginner" if experience_level == "beginner" else "intermediate"
        })
    
    return learning_plan

async def _generate_market_recommendations(market_data: Dict[str, Any], field: str) -> List[str]:
    """Generate recommendations based on market data"""
    
    recommendations = []
    
    market_info = market_data.get("market_data", {})
    
    if market_info.get("growth_rate", "0%").replace("%", "").replace("+", "").replace("-", "").isdigit():
        growth = int(market_info["growth_rate"].replace("%", "").replace("+", "").replace("-", ""))
        if growth > 10:
            recommendations.append(f"High growth potential in {field} with {growth}% growth rate")
        elif growth > 5:
            recommendations.append(f"Moderate growth expected in {field}")
        else:
            recommendations.append(f"Stable market in {field} with steady opportunities")
    
    if market_info.get("job_openings", 0) > 1000:
        recommendations.append("High number of job openings available")
    
    if market_info.get("required_skills"):
        recommendations.append(f"Focus on developing: {', '.join(market_info['required_skills'][:3])}")
    
    return recommendations

async def _generate_personalized_timeline(grade: str, target_field: str, state: str) -> Dict[str, Any]:
    """Generate a personalized academic timeline"""
    
    timeline = {
        "current_phase": f"Grade {grade}",
        "next_milestones": [],
        "preparation_activities": [],
        "important_deadlines": []
    }
    
    if grade in ["11th", "12th"]:
        timeline["next_milestones"] = [
            "Board exams preparation",
            "Entrance exam registration",
            "College application process",
            "Career counseling sessions"
        ]
        
        timeline["preparation_activities"] = [
            "Complete syllabus revision",
            "Practice entrance exam papers",
            "Research college options",
            "Develop application portfolio"
        ]
    
    return timeline

async def _generate_preparation_schedule(grade: str, target_field: str) -> Dict[str, Any]:
    """Generate a preparation schedule based on grade and field"""
    
    schedule = {
        "weekly_plan": {},
        "monthly_goals": [],
        "resources": []
    }
    
    if target_field and "engineering" in target_field.lower():
        schedule["weekly_plan"] = {
            "monday": "Mathematics practice",
            "tuesday": "Physics concepts",
            "wednesday": "Chemistry problems",
            "thursday": "Previous year papers",
            "friday": "Mock tests",
            "weekend": "Revision and analysis"
        }
    
    return schedule

async def _generate_follow_up_suggestions(message: str, context: Dict[str, Any]) -> List[str]:
    """Generate follow-up suggestions for chat"""
    
    suggestions = [
        "Tell me more about specific courses",
        "What are the best colleges for my interests?",
        "How can I prepare for entrance exams?",
        "What career paths align with my aptitude scores?",
        "Show me scholarship opportunities"
    ]
    
    # Customize based on message content
    if "college" in message.lower():
        suggestions.insert(0, "Compare colleges in my area")
    elif "career" in message.lower():
        suggestions.insert(0, "Explore related career options")
    elif "exam" in message.lower():
        suggestions.insert(0, "Get exam preparation tips")
    
    return suggestions[:4]  # Return top 4 suggestions

def _calculate_data_completeness(db_data: Dict, scraped_data: Dict) -> float:
    """Calculate data completeness score"""
    
    total_fields = 10  # Expected number of key fields
    available_fields = 0
    
    if db_data:
        available_fields += len([k for k, v in db_data.items() if v])
    
    if scraped_data:
        available_fields += len([k for k, v in scraped_data.items() if v])
    
    return min(available_fields / total_fields * 100, 100)

def _calculate_reliability_score(scraped_data: Dict) -> float:
    """Calculate reliability score based on data sources"""
    
    if not scraped_data.get("data_sources"):
        return 0.5
    
    sources = scraped_data["data_sources"]
    base_score = 0.6
    
    if sources >= 3:
        base_score = 0.9
    elif sources >= 2:
        base_score = 0.8
    elif sources >= 1:
        base_score = 0.7
    
    return base_score
