"""
Advanced AI Agent Service for Career Guidance
Implements agentic AI with multiple specialized agents for different tasks
"""

import json
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from app.services.groq_service import GroqService
from app.services.database import get_database
import logging

logger = logging.getLogger(__name__)

class AgentType(Enum):
    CAREER_ADVISOR = "career_advisor"
    COURSE_RECOMMENDER = "course_recommender"
    COLLEGE_FINDER = "college_finder"
    SKILL_ANALYZER = "skill_analyzer"
    MARKET_RESEARCHER = "market_researcher"

@dataclass
class UserProfile:
    user_id: str
    age: int
    grade: str
    interests: List[str]
    aptitude_scores: Dict[str, float]
    academic_performance: Dict[str, Any]
    location: Dict[str, str]
    career_goals: List[str]
    personality_traits: Dict[str, float]

@dataclass
class AgentResponse:
    agent_type: AgentType
    confidence: float
    recommendations: List[Dict[str, Any]]
    reasoning: str
    next_actions: List[str]

class AIAgent:
    """Base class for AI agents"""
    
    def __init__(self, agent_type: AgentType, groq_service: GroqService):
        self.agent_type = agent_type
        self.groq_service = groq_service
        self.system_prompt = self._get_system_prompt()
    
    def _get_system_prompt(self) -> str:
        prompts = {
            AgentType.CAREER_ADVISOR: """
            You are an expert career advisor with deep knowledge of Indian education system and job market.
            Your role is to analyze student profiles and provide personalized career guidance.
            Consider aptitude scores, interests, academic performance, and market trends.
            Provide actionable advice with clear reasoning.
            """,
            
            AgentType.COURSE_RECOMMENDER: """
            You are a course recommendation specialist with expertise in Indian higher education.
            Analyze student profiles to recommend suitable degree courses, streams, and specializations.
            Consider government college offerings, placement statistics, and career outcomes.
            """,
            
            AgentType.COLLEGE_FINDER: """
            You are a college search expert specializing in government colleges in India.
            Help students find suitable colleges based on location, courses, facilities, and admission criteria.
            Prioritize government colleges with good infrastructure and placement records.
            """,
            
            AgentType.SKILL_ANALYZER: """
            You are a skill assessment expert who analyzes student capabilities and identifies skill gaps.
            Recommend skill development programs, certifications, and learning resources.
            Focus on industry-relevant skills and emerging technologies.
            """,
            
            AgentType.MARKET_RESEARCHER: """
            You are a job market analyst with real-time knowledge of industry trends and employment opportunities.
            Provide insights on career prospects, salary expectations, and growth potential.
            Focus on government jobs, private sector opportunities, and entrepreneurship options.
            """
        }
        return prompts.get(self.agent_type, "You are a helpful AI assistant.")
    
    async def process(self, user_profile: UserProfile, context: Dict[str, Any] = None) -> AgentResponse:
        """Process user request and return agent response"""
        raise NotImplementedError("Subclasses must implement process method")

class CareerAdvisorAgent(AIAgent):
    """Specialized agent for career guidance"""
    
    async def process(self, user_profile: UserProfile, context: Dict[str, Any] = None) -> AgentResponse:
        prompt = f"""
        Analyze this student profile and provide comprehensive career guidance:
        
        Student Details:
        - Age: {user_profile.age}
        - Grade: {user_profile.grade}
        - Interests: {', '.join(user_profile.interests)}
        - Location: {user_profile.location}
        - Career Goals: {', '.join(user_profile.career_goals)}
        
        Aptitude Scores:
        {json.dumps(user_profile.aptitude_scores, indent=2)}
        
        Academic Performance:
        {json.dumps(user_profile.academic_performance, indent=2)}
        
        Personality Traits:
        {json.dumps(user_profile.personality_traits, indent=2)}
        
        Provide:
        1. Top 3 career paths with detailed analysis
        2. Reasoning for each recommendation
        3. Required skills and qualifications
        4. Next steps and timeline
        5. Potential challenges and solutions
        
        Format as JSON with confidence scores.
        """
        
        try:
            response = await self.groq_service.get_completion(prompt, self.system_prompt)
            parsed_response = self._parse_response(response)
            
            return AgentResponse(
                agent_type=self.agent_type,
                confidence=parsed_response.get("confidence", 0.8),
                recommendations=parsed_response.get("career_paths", []),
                reasoning=parsed_response.get("reasoning", ""),
                next_actions=parsed_response.get("next_steps", [])
            )
        except Exception as e:
            logger.error(f"Career advisor agent error: {e}")
            return self._fallback_response()
    
    def _parse_response(self, response: str) -> Dict[str, Any]:
        """Parse AI response into structured format"""
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            # Fallback parsing logic
            return {
                "confidence": 0.7,
                "career_paths": [],
                "reasoning": response,
                "next_steps": []
            }
    
    def _fallback_response(self) -> AgentResponse:
        """Provide fallback response in case of errors"""
        return AgentResponse(
            agent_type=self.agent_type,
            confidence=0.5,
            recommendations=[],
            reasoning="Unable to process request due to technical issues",
            next_actions=["Please try again later"]
        )

class CourseRecommenderAgent(AIAgent):
    """Specialized agent for course recommendations"""
    
    async def process(self, user_profile: UserProfile, context: Dict[str, Any] = None) -> AgentResponse:
        db = get_database()
        
        # Get available courses from database
        courses_cursor = db.courses.find({})
        available_courses = await courses_cursor.to_list(length=100)
        
        prompt = f"""
        Based on the student profile, recommend the best courses from available options:
        
        Student Profile:
        - Grade: {user_profile.grade}
        - Interests: {', '.join(user_profile.interests)}
        - Aptitude Scores: {json.dumps(user_profile.aptitude_scores)}
        - Career Goals: {', '.join(user_profile.career_goals)}
        
        Available Courses:
        {json.dumps([course.get('title', '') for course in available_courses[:20]], indent=2)}
        
        Provide:
        1. Top 5 course recommendations with match percentage
        2. Detailed reasoning for each recommendation
        3. Career prospects for each course
        4. Prerequisites and eligibility criteria
        5. Course difficulty assessment
        
        Format as JSON.
        """
        
        try:
            response = await self.groq_service.get_completion(prompt, self.system_prompt)
            parsed_response = self._parse_response(response)
            
            # Enrich recommendations with database data
            enriched_recommendations = await self._enrich_course_recommendations(
                parsed_response.get("recommendations", []), available_courses
            )
            
            return AgentResponse(
                agent_type=self.agent_type,
                confidence=parsed_response.get("confidence", 0.8),
                recommendations=enriched_recommendations,
                reasoning=parsed_response.get("reasoning", ""),
                next_actions=parsed_response.get("next_steps", [])
            )
        except Exception as e:
            logger.error(f"Course recommender agent error: {e}")
            return self._fallback_response()
    
    async def _enrich_course_recommendations(self, recommendations: List[Dict], available_courses: List[Dict]) -> List[Dict]:
        """Enrich recommendations with detailed course data"""
        enriched = []
        course_map = {course['title']: course for course in available_courses}
        
        for rec in recommendations:
            course_title = rec.get('course_name', '')
            if course_title in course_map:
                course_data = course_map[course_title]
                rec.update({
                    'course_details': course_data,
                    'duration': course_data.get('duration', 'N/A'),
                    'average_salary': course_data.get('averageSalary', 0),
                    'top_recruiters': course_data.get('topRecruiters', [])
                })
            enriched.append(rec)
        
        return enriched
    
    def _parse_response(self, response: str) -> Dict[str, Any]:
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "confidence": 0.7,
                "recommendations": [],
                "reasoning": response,
                "next_steps": []
            }
    
    def _fallback_response(self) -> AgentResponse:
        return AgentResponse(
            agent_type=self.agent_type,
            confidence=0.5,
            recommendations=[],
            reasoning="Unable to process course recommendations",
            next_actions=["Please try again later"]
        )

class CollegeFinderAgent(AIAgent):
    """Specialized agent for finding suitable colleges"""
    
    async def process(self, user_profile: UserProfile, context: Dict[str, Any] = None) -> AgentResponse:
        db = get_database()
        
        # Get colleges based on location preference
        location_filter = {}
        if user_profile.location.get('state'):
            location_filter['location.state'] = user_profile.location['state']
        
        colleges_cursor = db.colleges.find(location_filter).limit(50)
        available_colleges = await colleges_cursor.to_list(length=50)
        
        prompt = f"""
        Find the best colleges for this student:
        
        Student Profile:
        - Location: {user_profile.location}
        - Interests: {', '.join(user_profile.interests)}
        - Academic Performance: {json.dumps(user_profile.academic_performance)}
        - Preferred Courses: {', '.join(user_profile.career_goals)}
        
        Available Colleges (sample):
        {json.dumps([{
            'name': college.get('name', ''),
            'location': college.get('location', {}),
            'type': college.get('type', ''),
            'facilities': college.get('facilities', [])
        } for college in available_colleges[:10]], indent=2)}
        
        Provide:
        1. Top 5 college recommendations with match score
        2. Admission requirements and cutoffs
        3. Facilities and infrastructure analysis
        4. Distance and accessibility factors
        5. Placement statistics and outcomes
        
        Format as JSON.
        """
        
        try:
            response = await self.groq_service.get_completion(prompt, self.system_prompt)
            parsed_response = self._parse_response(response)
            
            # Enrich with real college data
            enriched_recommendations = await self._enrich_college_recommendations(
                parsed_response.get("recommendations", []), available_colleges
            )
            
            return AgentResponse(
                agent_type=self.agent_type,
                confidence=parsed_response.get("confidence", 0.8),
                recommendations=enriched_recommendations,
                reasoning=parsed_response.get("reasoning", ""),
                next_actions=parsed_response.get("next_steps", [])
            )
        except Exception as e:
            logger.error(f"College finder agent error: {e}")
            return self._fallback_response()
    
    async def _enrich_college_recommendations(self, recommendations: List[Dict], available_colleges: List[Dict]) -> List[Dict]:
        """Enrich recommendations with detailed college data"""
        enriched = []
        college_map = {college['name']: college for college in available_colleges}
        
        for rec in recommendations:
            college_name = rec.get('college_name', '')
            if college_name in college_map:
                college_data = college_map[college_name]
                rec.update({
                    'college_details': college_data,
                    'contact': college_data.get('contact', {}),
                    'facilities': college_data.get('facilities', {}),
                    'rankings': college_data.get('rankings', {})
                })
            enriched.append(rec)
        
        return enriched
    
    def _parse_response(self, response: str) -> Dict[str, Any]:
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "confidence": 0.7,
                "recommendations": [],
                "reasoning": response,
                "next_steps": []
            }
    
    def _fallback_response(self) -> AgentResponse:
        return AgentResponse(
            agent_type=self.agent_type,
            confidence=0.5,
            recommendations=[],
            reasoning="Unable to process college recommendations",
            next_actions=["Please try again later"]
        )

class AgentOrchestrator:
    """Orchestrates multiple AI agents for comprehensive guidance"""
    
    def __init__(self):
        self.groq_service = GroqService()
        self.agents = {
            AgentType.CAREER_ADVISOR: CareerAdvisorAgent(AgentType.CAREER_ADVISOR, self.groq_service),
            AgentType.COURSE_RECOMMENDER: CourseRecommenderAgent(AgentType.COURSE_RECOMMENDER, self.groq_service),
            AgentType.COLLEGE_FINDER: CollegeFinderAgent(AgentType.COLLEGE_FINDER, self.groq_service),
        }
    
    async def get_comprehensive_guidance(self, user_profile: UserProfile) -> Dict[str, Any]:
        """Get comprehensive guidance by coordinating multiple agents"""
        
        # Run agents in parallel for efficiency
        tasks = []
        for agent_type, agent in self.agents.items():
            tasks.append(agent.process(user_profile))
        
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Compile results
        results = {
            "user_profile": user_profile.__dict__,
            "agent_responses": {},
            "consolidated_recommendations": {},
            "confidence_score": 0.0
        }
        
        total_confidence = 0
        valid_responses = 0
        
        for i, response in enumerate(responses):
            if isinstance(response, Exception):
                logger.error(f"Agent {list(self.agents.keys())[i]} failed: {response}")
                continue
            
            agent_type = response.agent_type
            results["agent_responses"][agent_type.value] = {
                "confidence": response.confidence,
                "recommendations": response.recommendations,
                "reasoning": response.reasoning,
                "next_actions": response.next_actions
            }
            
            total_confidence += response.confidence
            valid_responses += 1
        
        # Calculate overall confidence
        if valid_responses > 0:
            results["confidence_score"] = total_confidence / valid_responses
        
        # Generate consolidated recommendations
        results["consolidated_recommendations"] = await self._consolidate_recommendations(results)
        
        return results
    
    async def _consolidate_recommendations(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Consolidate recommendations from multiple agents"""
        
        consolidated = {
            "priority_actions": [],
            "career_paths": [],
            "courses": [],
            "colleges": [],
            "timeline": [],
            "resources": []
        }
        
        # Extract and prioritize recommendations from each agent
        agent_responses = results.get("agent_responses", {})
        
        # Career paths from career advisor
        if "career_advisor" in agent_responses:
            career_recs = agent_responses["career_advisor"]["recommendations"]
            consolidated["career_paths"] = career_recs[:3]  # Top 3
        
        # Courses from course recommender
        if "course_recommender" in agent_responses:
            course_recs = agent_responses["course_recommender"]["recommendations"]
            consolidated["courses"] = course_recs[:5]  # Top 5
        
        # Colleges from college finder
        if "college_finder" in agent_responses:
            college_recs = agent_responses["college_finder"]["recommendations"]
            consolidated["colleges"] = college_recs[:5]  # Top 5
        
        # Generate timeline and resources
        consolidated["timeline"] = self._generate_timeline(consolidated)
        consolidated["resources"] = self._generate_resources(consolidated)
        
        return consolidated
    
    def _generate_timeline(self, recommendations: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate a timeline based on recommendations"""
        timeline = [
            {
                "phase": "Immediate (Next 1-2 months)",
                "actions": [
                    "Complete aptitude and interest assessments",
                    "Research recommended career paths",
                    "Identify skill gaps and development needs"
                ]
            },
            {
                "phase": "Short-term (3-6 months)",
                "actions": [
                    "Apply to recommended courses and colleges",
                    "Start skill development programs",
                    "Network with professionals in target fields"
                ]
            },
            {
                "phase": "Medium-term (6-12 months)",
                "actions": [
                    "Begin academic program",
                    "Gain practical experience through internships",
                    "Build portfolio and professional profile"
                ]
            }
        ]
        return timeline
    
    def _generate_resources(self, recommendations: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate learning resources based on recommendations"""
        resources = [
            {
                "category": "Skill Development",
                "items": [
                    {"name": "Coursera", "type": "Online Courses", "url": "https://coursera.org"},
                    {"name": "Udemy", "type": "Skill Training", "url": "https://udemy.com"},
                    {"name": "edX", "type": "University Courses", "url": "https://edx.org"}
                ]
            },
            {
                "category": "Government Resources",
                "items": [
                    {"name": "SWAYAM", "type": "Free Online Courses", "url": "https://swayam.gov.in"},
                    {"name": "Skill India", "type": "Skill Development", "url": "https://skillindia.gov.in"},
                    {"name": "Digital India", "type": "Digital Literacy", "url": "https://digitalindia.gov.in"}
                ]
            },
            {
                "category": "Career Guidance",
                "items": [
                    {"name": "National Career Service", "type": "Job Portal", "url": "https://ncs.gov.in"},
                    {"name": "LinkedIn Learning", "type": "Professional Development", "url": "https://linkedin.com/learning"},
                    {"name": "Internshala", "type": "Internships", "url": "https://internshala.com"}
                ]
            }
        ]
        return resources

# Singleton instance
agent_orchestrator = AgentOrchestrator()
