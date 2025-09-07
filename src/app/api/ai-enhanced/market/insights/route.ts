import { NextRequest, NextResponse } from 'next/server'

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fields = searchParams.get('fields')
    
    const response = await fetch(`${FASTAPI_BASE_URL}/api/ai-enhanced/market/insights?fields=${fields}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      // Return mock data if FastAPI is not available
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        market_overview: {
          trending_fields: [
            {
              field: 'Artificial Intelligence & Machine Learning',
              growth_rate: '25%',
              job_openings: 15000,
              avg_salary: '₹8-20 LPA',
              hot_skills: ['Python', 'TensorFlow', 'Deep Learning', 'NLP'],
              companies_hiring: ['Google', 'Microsoft', 'Amazon', 'Flipkart']
            },
            {
              field: 'Cybersecurity',
              growth_rate: '18%',
              job_openings: 8000,
              avg_salary: '₹6-15 LPA',
              hot_skills: ['Ethical Hacking', 'Network Security', 'CISSP', 'Penetration Testing'],
              companies_hiring: ['IBM', 'Cisco', 'Deloitte', 'EY']
            },
            {
              field: 'Cloud Computing',
              growth_rate: '22%',
              job_openings: 12000,
              avg_salary: '₹7-18 LPA',
              hot_skills: ['AWS', 'Azure', 'Kubernetes', 'Docker'],
              companies_hiring: ['AWS', 'Microsoft', 'TCS', 'Accenture']
            }
          ],
          industry_demand: {
            'Information Technology': { demand: 'Very High', growth: '20%' },
            'Healthcare': { demand: 'High', growth: '15%' },
            'Finance': { demand: 'High', growth: '12%' },
            'E-commerce': { demand: 'Very High', growth: '25%' },
            'Education Technology': { demand: 'High', growth: '18%' }
          },
          skill_demand: {
            'Programming Languages': { demand_score: 95, trending: ['Python', 'JavaScript', 'Go'] },
            'Data Science': { demand_score: 88, trending: ['Machine Learning', 'Big Data', 'Analytics'] },
            'Cloud Technologies': { demand_score: 92, trending: ['AWS', 'Kubernetes', 'Serverless'] },
            'Mobile Development': { demand_score: 82, trending: ['Flutter', 'React Native', 'Swift'] }
          }
        },
        regional_insights: {
          'Bangalore': { 
            top_industries: ['IT Services', 'Startups', 'R&D'],
            avg_salary_multiplier: 1.2,
            job_availability: 'Very High'
          },
          'Hyderabad': {
            top_industries: ['IT Services', 'Pharma', 'Aerospace'],
            avg_salary_multiplier: 1.1,
            job_availability: 'High'
          },
          'Pune': {
            top_industries: ['IT Services', 'Automotive', 'Manufacturing'],
            avg_salary_multiplier: 1.0,
            job_availability: 'High'
          }
        },
        salary_insights: {
          'Entry Level (0-2 years)': '₹3-8 LPA',
          'Mid Level (3-6 years)': '₹8-18 LPA',
          'Senior Level (7-12 years)': '₹18-35 LPA',
          'Leadership (12+ years)': '₹35-80 LPA'
        },
        future_outlook: {
          emerging_technologies: [
            'Quantum Computing',
            'Web3 & Blockchain',
            'Augmented Reality',
            'IoT & Edge Computing',
            'Green Technology'
          ],
          skill_predictions: [
            'AI/ML skills will be essential across all tech roles',
            'Cloud-native development becoming standard',
            'Cybersecurity skills in high demand',
            'Data literacy required for most positions'
          ]
        }
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error calling FastAPI:', error)
    
    // Return fallback mock data
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      market_overview: {
        trending_fields: [
          {
            field: 'Technology',
            growth_rate: '15%',
            job_openings: 10000,
            avg_salary: '₹6-12 LPA',
            hot_skills: ['Programming', 'Problem Solving'],
            companies_hiring: ['Various Tech Companies']
          }
        ],
        industry_demand: {
          'Technology': { demand: 'High', growth: '15%' }
        },
        skill_demand: {
          'Programming': { demand_score: 80, trending: ['Python', 'JavaScript'] }
        }
      },
      regional_insights: {},
      salary_insights: {},
      future_outlook: {
        emerging_technologies: [],
        skill_predictions: []
      }
    })
  }
}
