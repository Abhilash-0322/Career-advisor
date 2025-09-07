# FastAPI Career Advisor Backend

A powerful FastAPI backend for the Career Advisor platform, providing AI-powered career guidance, course recommendations, and college selection assistance.

## Features

- **RESTful API** with comprehensive endpoints for courses, colleges, and aptitude tests
- **AI Integration** using Groq for personalized career recommendations
- **MongoDB Database** with async operations using Motor
- **Pydantic Models** for type safety and data validation
- **CORS Support** for seamless frontend integration
- **Modular Architecture** with separate routers and services

## Quick Start

### Prerequisites

- Python 3.8+
- MongoDB instance
- Groq API key

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd fastapi-backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017
GROQ_API_KEY=your_groq_api_key_here
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## API Endpoints

### Courses
- `GET /api/courses/` - Get courses with filtering
- `GET /api/courses/{course_id}` - Get specific course
- `GET /api/courses/categories/list` - Get all categories
- `GET /api/courses/recommendations/{user_id}` - Get personalized recommendations

### Colleges
- `GET /api/colleges/` - Get colleges with filtering
- `GET /api/colleges/{college_id}` - Get specific college
- `GET /api/colleges/locations/list` - Get all locations
- `GET /api/colleges/types/list` - Get college types
- `GET /api/colleges/recommendations/{user_id}` - Get recommendations

### Aptitude Tests
- `GET /api/aptitude/questions/{test_type}` - Get test questions
- `POST /api/aptitude/submit` - Submit test answers
- `GET /api/aptitude/results/{user_id}` - Get user results
- `GET /api/aptitude/categories` - Get test categories

### AI Recommendations
- `POST /api/ai/recommendations/personalized` - Get AI recommendations
- `POST /api/ai/chat` - AI-powered career chat
- `POST /api/ai/analyze/skills` - Analyze user skills
- `POST /api/ai/market/trends` - Get market trends

## Project Structure

```
fastapi-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py          # Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── courses.py          # Course endpoints
│   │   ├── colleges.py         # College endpoints
│   │   ├── aptitude.py         # Aptitude test endpoints
│   │   └── ai_recommendations.py # AI-powered endpoints
│   └── services/
│       ├── __init__.py
│       ├── database.py         # MongoDB connection
│       └── groq_service.py     # Groq AI integration
├── requirements.txt
├── .env.example
└── README.md
```

## Integration with Next.js Frontend

The FastAPI backend is designed to work seamlessly with the Next.js frontend. Update your Next.js API routes to proxy requests to the FastAPI backend:

```javascript
// In your Next.js API routes
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export async function GET(request) {
  const response = await fetch(`${FASTAPI_URL}/api/courses/`);
  return Response.json(await response.json());
}
```

## Development

### Adding New Endpoints

1. Create new router in `app/routers/`
2. Add business logic and database operations
3. Include router in `main.py`
4. Update Pydantic models if needed

### Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### API Documentation

FastAPI automatically generates API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

### Using Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using PM2

```bash
pm2 start "uvicorn app.main:app --host 0.0.0.0 --port 8000" --name career-advisor-api
```

## Architecture Benefits

- **Separation of Concerns**: Clean separation between frontend UI and backend logic
- **Scalability**: Independent scaling of frontend and backend services
- **Performance**: Optimized database operations with async/await
- **Maintainability**: Modular structure with clear responsibilities
- **Type Safety**: Full TypeScript-like type checking with Pydantic
- **API Documentation**: Auto-generated interactive documentation

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## License

MIT License - see LICENSE file for details
