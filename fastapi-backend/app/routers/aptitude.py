from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any
from app.services.database import get_database
from app.models.schemas import AptitudeQuestion, AptitudeResult
from datetime import datetime
import random

router = APIRouter()

@router.get("/questions/{test_type}")
async def get_aptitude_questions(
    test_type: str,
    difficulty: str = "mixed",
    count: int = 10
):
    """Get aptitude test questions"""
    db = get_database()
    
    # Build query
    query = {"category": test_type}
    if difficulty != "mixed":
        query["difficulty"] = difficulty
    
    # Get questions from database
    cursor = db.aptitude_questions.find(query)
    all_questions = await cursor.to_list(length=None)
    
    if len(all_questions) < count:
        raise HTTPException(
            status_code=404, 
            detail=f"Not enough {test_type} questions available"
        )
    
    # Randomly select questions
    selected_questions = random.sample(all_questions, count)
    
    # Convert ObjectId to string and remove correct_answer for test
    for question in selected_questions:
        question["_id"] = str(question["_id"])
        # Don't send correct answer to client
        question.pop("correct_answer", None)
        question.pop("explanation", None)
    
    return {"questions": selected_questions, "test_type": test_type}

@router.post("/submit")
async def submit_aptitude_test(
    payload: Dict[str, Any] = Body(...)
):
    """Submit aptitude test and get results"""
    db = get_database()
    
    user_id = payload.get("user_id")
    test_type = payload.get("test_type")
    answers = payload.get("answers", {})  # question_id -> answer_index
    time_taken = payload.get("time_taken", 0)
    
    if not user_id or not test_type or not answers:
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    # Get correct answers
    question_ids = list(answers.keys())
    cursor = db.aptitude_questions.find({"_id": {"$in": question_ids}})
    questions = await cursor.to_list(length=None)
    
    # Calculate score
    correct_answers = 0
    total_questions = len(questions)
    category_scores = {}
    
    for question in questions:
        question_id = str(question["_id"])
        user_answer = answers.get(question_id)
        correct_answer = question["correct_answer"]
        category = question["category"]
        
        # Initialize category score if not exists
        if category not in category_scores:
            category_scores[category] = {"correct": 0, "total": 0}
        
        category_scores[category]["total"] += 1
        
        if user_answer == correct_answer:
            correct_answers += 1
            category_scores[category]["correct"] += 1
    
    # Calculate percentage scores
    overall_score = (correct_answers / total_questions) * 100
    for category in category_scores:
        total = category_scores[category]["total"]
        correct = category_scores[category]["correct"]
        category_scores[category]["percentage"] = (correct / total) * 100
    
    # Generate recommendations based on performance
    recommendations = generate_recommendations(overall_score, category_scores, test_type)
    
    # Save result
    result = AptitudeResult(
        user_id=user_id,
        test_type=test_type,
        score=int(overall_score),
        total_questions=total_questions,
        time_taken=time_taken,
        category_scores=category_scores,
        recommendations=recommendations
    )
    
    # Insert into database
    result_dict = result.dict()
    result_dict.pop("id", None)  # Remove id field for insertion
    insert_result = await db.aptitude_results.insert_one(result_dict)
    
    # Update user's aptitude results
    await db.users.update_one(
        {"_id": user_id},
        {"$push": {"aptitude_results": str(insert_result.inserted_id)}}
    )
    
    return {
        "result_id": str(insert_result.inserted_id),
        "score": int(overall_score),
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "category_scores": category_scores,
        "recommendations": recommendations,
        "performance_level": get_performance_level(overall_score)
    }

@router.get("/results/{user_id}")
async def get_user_aptitude_results(user_id: str):
    """Get all aptitude test results for a user"""
    db = get_database()
    
    cursor = db.aptitude_results.find({"user_id": user_id}).sort("completed_at", -1)
    results = await cursor.to_list(length=None)
    
    # Convert ObjectId to string
    for result in results:
        result["_id"] = str(result["_id"])
    
    return {"results": results}

@router.get("/categories")
async def get_test_categories():
    """Get available test categories"""
    return {
        "categories": [
            {
                "id": "logical",
                "name": "Logical Reasoning",
                "description": "Test your logical thinking and problem-solving abilities"
            },
            {
                "id": "numerical",
                "name": "Numerical Ability",
                "description": "Assess your mathematical and quantitative skills"
            },
            {
                "id": "verbal",
                "name": "Verbal Reasoning",
                "description": "Evaluate your language and comprehension skills"
            },
            {
                "id": "spatial",
                "name": "Spatial Intelligence",
                "description": "Test your visual and spatial reasoning abilities"
            }
        ]
    }

def generate_recommendations(score: float, category_scores: Dict, test_type: str) -> List[str]:
    """Generate career recommendations based on aptitude test results"""
    recommendations = []
    
    if score >= 80:
        recommendations.append(f"Excellent performance in {test_type}! Consider advanced courses in this area.")
    elif score >= 60:
        recommendations.append(f"Good performance in {test_type}. You have strong potential in this area.")
    else:
        recommendations.append(f"Consider practicing more {test_type} skills to improve your performance.")
    
    # Add category-specific recommendations
    for category, scores in category_scores.items():
        percentage = scores["percentage"]
        if percentage >= 80:
            recommendations.append(f"Strong {category} skills detected. Consider careers that require these abilities.")
        elif percentage < 50:
            recommendations.append(f"Work on improving your {category} skills for better overall performance.")
    
    return recommendations

def get_performance_level(score: float) -> str:
    """Get performance level based on score"""
    if score >= 90:
        return "Excellent"
    elif score >= 80:
        return "Very Good"
    elif score >= 70:
        return "Good"
    elif score >= 60:
        return "Average"
    else:
        return "Needs Improvement"
