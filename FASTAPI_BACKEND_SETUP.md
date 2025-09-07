# Career Advisor FastAPI Backend

## Project Structure
```
career-advisor-backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── course.py
│   │   ├── college.py
│   │   ├── user.py
│   │   └── aptitude.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── courses.py
│   │   ├── colleges.py
│   │   ├── aptitude.py
│   │   └── ai_recommendations.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py
│   │   ├── database.py
│   │   └── groq_client.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── security.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── requirements.txt
├── .env
└── README.md
```

## Installation & Setup

1. Create virtual environment:
```bash
python -m venv career-backend-env
source career-backend-env/bin/activate  # On Windows: career-backend-env\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variables in .env:
```
MONGODB_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_secret_key
```

4. Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### Authentication
- POST /auth/register
- POST /auth/login
- GET /auth/me

### Courses
- GET /courses - List courses with filters
- GET /courses/{id} - Get course details
- POST /courses - Create course (admin)

### Colleges
- GET /colleges - List colleges with filters
- GET /colleges/{id} - Get college details
- POST /colleges - Create college (admin)

### Aptitude Tests
- GET /aptitude/questions - Get test questions
- POST /aptitude/submit - Submit test answers
- GET /aptitude/results/{test_id} - Get test results

### AI Recommendations
- POST /ai/analyze-profile - Analyze user profile
- POST /ai/recommend-courses - Get course recommendations
- POST /ai/recommend-colleges - Get college recommendations
- POST /ai/career-roadmap - Generate career roadmap

## Benefits of FastAPI Backend

1. **Performance**: Async/await support, faster than traditional Python web frameworks
2. **Automatic Documentation**: Interactive API docs at /docs
3. **Type Safety**: Pydantic models for request/response validation
4. **Easy Testing**: Built-in testing support
5. **Scalability**: Easy to containerize and deploy
6. **AI Integration**: Better handling of ML/AI workloads
7. **Database Flexibility**: Easy to switch between MongoDB, PostgreSQL, etc.

## Integration with Next.js Frontend

The Next.js frontend will consume the FastAPI backend through API calls:

```typescript
// Frontend API client
const API_BASE_URL = 'http://localhost:8000'

export const apiClient = {
  courses: {
    list: (filters) => fetch(`${API_BASE_URL}/courses?${new URLSearchParams(filters)}`),
    get: (id) => fetch(`${API_BASE_URL}/courses/${id}`),
  },
  ai: {
    getRecommendations: (profile) => 
      fetch(`${API_BASE_URL}/ai/recommend-courses`, {
        method: 'POST',
        body: JSON.stringify(profile)
      })
  }
}
```
