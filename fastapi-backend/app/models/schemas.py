from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class Course(BaseModel):
    id: Optional[str] = Field(alias="_id")
    title: str
    description: str
    duration: str
    difficulty: str
    category: str
    skills: List[str]
    prerequisites: List[str]
    career_paths: List[str]
    provider: str
    rating: float
    price: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class College(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str
    location: str
    type: str  # Government, Private, Deemed
    established: int
    courses_offered: List[str]
    entrance_exams: List[str]
    facilities: List[str]
    ranking: Optional[int] = None
    fees_range: str
    placement_rate: float
    rating: float
    website: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AptitudeQuestion(BaseModel):
    id: Optional[str] = Field(alias="_id")
    question: str
    options: List[str]
    correct_answer: int
    category: str  # logical, numerical, verbal, spatial
    difficulty: str  # easy, medium, hard
    explanation: str
    time_limit: int  # in seconds

class AptitudeResult(BaseModel):
    id: Optional[str] = Field(alias="_id")
    user_id: str
    test_type: str
    score: int
    total_questions: int
    time_taken: int  # in seconds
    category_scores: dict  # category-wise breakdown
    recommendations: List[str]
    completed_at: datetime = Field(default_factory=datetime.utcnow)

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")
    name: str
    email: str
    grade: Optional[str] = None
    interests: List[str] = []
    aptitude_results: List[str] = []  # AptitudeResult IDs
    saved_courses: List[str] = []  # Course IDs
    saved_colleges: List[str] = []  # College IDs
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Additional Models for AI Recommendations and User Analysis

class AcademicProfile(BaseModel):
    educationLevel: Optional[str] = None
    gpa: Optional[float] = None
    grades: Optional[Dict[str, Any]] = None
    standardizedTestScores: Optional[Dict[str, Any]] = None

class CareerProfile(BaseModel):
    goals: Optional[List[str]] = None
    interestedIndustries: Optional[List[str]] = None
    preferredWorkStyle: Optional[str] = None
    careerStage: Optional[str] = None
    salaryExpectations: Optional[str] = None

class SkillsProfile(BaseModel):
    technicalSkills: Optional[List[str]] = None
    softSkills: Optional[List[str]] = None
    certifications: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    skillGaps: Optional[List[str]] = None

class ProfileData(BaseModel):
    academic: Optional[AcademicProfile] = None
    career: Optional[CareerProfile] = None
    skills: Optional[SkillsProfile] = None
    interests: Optional[List[str]] = None

class UserProfileForRecommendations(BaseModel):
    user_id: str
    email: Optional[str] = None
    academic_level: Optional[str] = None
    interests: Optional[List[str]] = []
    career_goals: Optional[List[str]] = []
    current_skills: Optional[List[str]] = []
    skill_gaps: Optional[List[str]] = []
    learning_style: Optional[str] = None
    time_commitment: Optional[str] = None
    budget_range: Optional[str] = None

class CourseRecommendationRequest(BaseModel):
    user_profile: UserProfileForRecommendations
    max_recommendations: Optional[int] = 10
    focus_areas: Optional[List[str]] = []

class CourseRecommendation(BaseModel):
    title: str
    provider: str
    description: str
    duration: str
    difficulty_level: str
    match_percentage: int
    reasoning: str
    skills_gained: List[str]
    prerequisites: List[str]
    estimated_cost: str
    rating: Optional[float] = None
    enrollments: Optional[int] = None
    url: Optional[str] = None

class UserAnalysisRequest(BaseModel):
    user_id: str
    email: Optional[str] = None
    profile_data: Optional[ProfileData] = None

class CourseRecommendationResponse(BaseModel):
    success: bool
    user_id: str
    recommendations: List[CourseRecommendation]
    total_found: int
    processing_time: Optional[float] = None
    generated_at: datetime

class UserAnalysisResponse(BaseModel):
    success: bool
    user_id: str
    analysis: Dict[str, Any]
    timestamp: str
