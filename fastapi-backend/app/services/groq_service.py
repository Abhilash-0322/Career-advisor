import os
from groq import Groq
from typing import Dict, Any, List, Optional
import json
from dotenv import load_dotenv
import asyncio

load_dotenv()

class GroqService:
    def __init__(self):
        self.client = Groq(
            api_key=""
        )
        self.model = "llama-3.1-8b-instant"
        self.max_retries = 3
        self.timeout = 30
    
    async def get_completion(self, prompt: str, system_prompt: str = None, temperature: float = 0.7) -> str:
        """Get completion from Groq API with enhanced error handling"""
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        for attempt in range(self.max_retries):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=2048,
                    timeout=self.timeout
                )
                return response.choices[0].message.content
            
            except Exception as e:
                if attempt == self.max_retries - 1:
                    raise e
                await asyncio.sleep(1 * (attempt + 1))  # Exponential backoff
        
        return ""
    
    async def get_structured_completion(self, prompt: str, system_prompt: str = None, schema: Dict[str, Any] = None) -> Dict[str, Any]:
        """Get structured JSON completion from Groq API"""
        
        if schema:
            prompt += f"\n\nPlease respond in the following JSON schema format:\n{json.dumps(schema, indent=2)}"
        
        response = await self.get_completion(prompt, system_prompt, temperature=0.3)
        
        try:
            # Try to parse as JSON
            return json.loads(response)
        except json.JSONDecodeError:
            # If JSON parsing fails, try to extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except json.JSONDecodeError:
                    pass
            
            # Return a structured fallback
            return {
                "error": "Could not parse structured response",
                "raw_response": response,
                "fallback": True
            }
    
    async def get_career_recommendations(self, user_profile: Dict[str, Any]) -> str:
        """Get personalized career recommendations based on user profile"""
        
        prompt = f"""
        Based on the following user profile, provide personalized career recommendations in JSON format:
        
        User Profile:
        - Interests: {user_profile.get('interests', [])}
        - Grade: {user_profile.get('grade', 'Not specified')}
        - Aptitude Test Results: {user_profile.get('aptitude_scores', [])}
        - Preferences: {user_profile.get('preferences', {})}
        
        Please provide recommendations in the following JSON structure:
        {{
            "insights": ["insight1", "insight2", "insight3"],
            "career_paths": ["career1", "career2", "career3"],
            "courses": ["course1", "course2", "course3"],
            "colleges": ["college_type1", "college_type2"],
            "next_steps": ["step1", "step2", "step3"]
        }}
        
        Focus on:
        1. Analyzing aptitude test results to identify strengths
        2. Matching interests with suitable career paths
        3. Recommending specific courses and skills to develop
        4. Suggesting college types or programs
        5. Providing actionable next steps
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert career counselor with deep knowledge of various career paths, educational requirements, and market trends. Provide personalized, actionable career guidance."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=1500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")
    
    async def get_chat_response(self, message: str, context: Dict[str, Any]) -> str:
        """Get AI response for career guidance chat"""
        
        context_str = ""
        if context:
            context_str = f"Context: {json.dumps(context, indent=2)}\n\n"
        
        prompt = f"""
        {context_str}User Question: {message}
        
        Provide a helpful, informative response about career guidance, education, or professional development.
        Keep the response conversational but informative, and offer specific actionable advice when possible.
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a friendly and knowledgeable career counselor. Help users with career-related questions, course recommendations, college selection, and professional development advice. Be encouraging and provide practical guidance."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.8,
                max_tokens=800
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")
    
    async def analyze_skills(self, skills: List[str], target_career: str = None) -> Dict[str, Any]:
        """Analyze user skills and provide improvement suggestions"""
        
        career_context = f" for a career in {target_career}" if target_career else ""
        
        prompt = f"""
        Analyze the following skills{career_context}:
        Skills: {', '.join(skills)}
        Target Career: {target_career or 'General career guidance'}
        
        Provide analysis in JSON format:
        {{
            "gaps": ["skill_gap1", "skill_gap2"],
            "strengths": ["strength1", "strength2"],
            "suggestions": ["improvement1", "improvement2"],
            "courses": ["recommended_course1", "recommended_course2"]
        }}
        
        Focus on:
        1. Identifying skill gaps for the target career
        2. Highlighting existing strengths
        3. Providing specific improvement suggestions
        4. Recommending relevant courses or certifications
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a skills assessment expert who helps people identify their strengths and areas for improvement in their professional development."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.6,
                max_tokens=1000
            )
            
            try:
                return json.loads(response.choices[0].message.content)
            except json.JSONDecodeError:
                # Fallback if response is not valid JSON
                content = response.choices[0].message.content
                return {
                    "gaps": [],
                    "strengths": [],
                    "suggestions": [content],
                    "courses": []
                }
            
        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")
    
    async def get_market_trends(self, field: str, location: str) -> Dict[str, Any]:
        """Get current job market trends and predictions"""
        
        prompt = f"""
        Provide current job market trends and insights for {field} in {location}.
        
        Respond in JSON format:
        {{
            "current": ["trend1", "trend2", "trend3"],
            "emerging": ["emerging_field1", "emerging_field2"],
            "salary": {{"average": "amount", "range": "range", "growth": "percentage"}},
            "growth": ["prediction1", "prediction2"]
        }}
        
        Include:
        1. Current market trends and in-demand skills
        2. Emerging fields and opportunities
        3. Salary insights and growth potential
        4. Future predictions and recommendations
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a market research analyst with expertise in job market trends, salary data, and industry forecasting. Provide current and accurate market insights."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.5,
                max_tokens=1200
            )
            
            try:
                return json.loads(response.choices[0].message.content)
            except json.JSONDecodeError:
                # Fallback if response is not valid JSON
                content = response.choices[0].message.content
                return {
                    "current": [content],
                    "emerging": [],
                    "salary": {},
                    "growth": []
                }
            
        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")
    
    async def generate_learning_path(self, career_goal: str, current_skills: List[str]) -> Dict[str, Any]:
        """Generate a personalized learning path for a career goal"""
        
        prompt = f"""
        Create a personalized learning path for someone who wants to pursue: {career_goal}
        
        Current skills: {', '.join(current_skills)}
        
        Provide a structured learning path in JSON format:
        {{
            "timeline": "recommended_duration",
            "phases": [
                {{
                    "phase": "Phase 1",
                    "duration": "timeframe",
                    "skills": ["skill1", "skill2"],
                    "resources": ["resource1", "resource2"],
                    "milestones": ["milestone1", "milestone2"]
                }}
            ],
            "certifications": ["cert1", "cert2"],
            "projects": ["project1", "project2"]
        }}
        
        Include:
        1. Realistic timeline broken into phases
        2. Skills to develop in each phase
        3. Learning resources and courses
        4. Key milestones and certifications
        5. Practical projects to build portfolio
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert learning and development advisor who creates comprehensive, realistic learning paths for career transitions and skill development."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.6,
                max_tokens=1500
            )
            
            try:
                return json.loads(response.choices[0].message.content)
            except json.JSONDecodeError:
                # Fallback if response is not valid JSON
                content = response.choices[0].message.content
                return {
                    "timeline": "6-12 months",
                    "phases": [{"phase": "Learning Phase", "skills": [content]}],
                    "certifications": [],
                    "projects": []
                }
            
        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")

# Create global instance
groq_service = GroqService()
