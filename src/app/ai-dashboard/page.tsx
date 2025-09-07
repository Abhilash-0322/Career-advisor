'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Target, 
  TrendingUp, 
  MapPin, 
  Clock, 
  BookOpen,
  Users,
  ChevronRight,
  Lightbulb,
  BarChart3,
  MessageCircle,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface AIRecommendation {
  type: string
  title: string
  description: string
  confidence: number
  priority: 'high' | 'medium' | 'low'
  actionItems: string[]
}

interface MarketInsight {
  field: string
  growthRate: string
  averageSalary: string
  jobOpenings: number
  requiredSkills: string[]
  topCompanies: string[]
}

interface SkillAnalysis {
  skillMatchPercentage: number
  matchingSkills: string[]
  skillGaps: string[]
  prioritySkills: string[]
  learningPlan: {
    immediateActions: string[]
    shortTermGoals: string[]
    resources: Array<{
      skill: string
      platform: string
      estimatedTime: string
      difficulty: string
    }>
  }
}
  personalizedAdvice: string
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: 18,
    education: '12th Grade',
    interests: [],
    location: '',
    familyIncome: 'Middle Class'
  })
  
  const [aptitudeScores, setAptitudeScores] = useState<AptitudeScore[]>([
    { category: 'Logical Reasoning', score: 0, percentage: 0 },
    { category: 'Numerical Ability', score: 0, percentage: 0 },
    { category: 'Verbal Reasoning', score: 0, percentage: 0 },
    { category: 'Spatial Reasoning', score: 0, percentage: 0 },
    { category: 'Abstract Reasoning', score: 0, percentage: 0 }
  ])

  const [preferences, setPreferences] = useState({
    preferred_fields: [] as string[],
    location_preference: '',
    budget_range: '',
    career_priorities: [] as string[]
  })

  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendations | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const interests = [
    'Technology', 'Medicine', 'Business', 'Arts', 'Science', 'Engineering',
    'Sports', 'Music', 'Design', 'Writing', 'Research', 'Teaching'
  ]

  const careerPriorities = [
    'High Salary', 'Job Security', 'Work-Life Balance', 'Growth Opportunities',
    'Social Impact', 'Creativity', 'Leadership', 'Innovation'
  ]

  const preferredFields = [
    'Engineering & Technology', 'Medical & Healthcare', 'Business & Management',
    'Arts & Humanities', 'Science & Research', 'Law & Government',
    'Design & Media', 'Education & Training'
  ]

  const handleInterestToggle = (interest: string) => {
    setUserProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handlePreferenceToggle = (field: string, type: 'fields' | 'priorities') => {
    const key = type === 'fields' ? 'preferred_fields' : 'career_priorities'
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(field)
        ? prev[key].filter(f => f !== field)
        : [...prev[key], field]
    }))
  }

  const generateAIRecommendations = async () => {
    setLoading(true)
    try {
      // First, get comprehensive AI recommendations
      const response = await fetch('/api/ai-enhanced/recommendations/comprehensive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: session?.user?.email || 'demo_user',
          preferences: {
            interests: userProfile.interests,
            skills: preferences.preferred_fields,
            experience_level: 'student',
            location_preference: preferences.location_preference,
            budget_range: preferences.budget_range
          },
          context: {
            education_level: userProfile.education_level,
            current_field: preferences.preferred_fields[0] || 'general',
            location: userProfile.location || 'India',
            aptitude_scores: aptitudeScores,
            career_priorities: preferences.career_priorities
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Transform API response to the existing format
        const transformedData = {
          careerPaths: data.ai_guidance?.consolidated_recommendations?.career_paths?.map((path: any) => ({
            title: path.title,
            description: path.description,
            compatibility: Math.round(path.confidence * 100),
            growthProspects: path.confidence > 0.8 ? 'Excellent' : path.confidence > 0.6 ? 'Good' : 'Moderate',
            averageSalary: '₹5-12 LPA', // Default range - can be enhanced with market data
            requiredSkills: path.next_steps || [],
            topColleges: ['IIT', 'NIT', 'State Universities'], // Default - can be enhanced
            jobRoles: [path.title + ' Specialist', path.title + ' Analyst']
          })) || [],
          skillAnalysis: {
            strengths: userProfile.interests.slice(0, 3),
            areasForImprovement: ['Technical Skills', 'Communication', 'Leadership'],
            recommendedCourses: data.ai_guidance?.consolidated_recommendations?.career_paths?.flatMap((path: any) => 
              path.next_steps?.slice(0, 2) || []
            ) || []
          },
          personalizedInsights: {
            summary: `Based on your profile analysis, we've identified ${data.ai_guidance?.consolidated_recommendations?.career_paths?.length || 0} potential career paths that align with your interests and aptitude.`,
            confidence: data.ai_guidance?.confidence_score || 0.8,
            recommendations: data.ai_guidance?.consolidated_recommendations?.career_paths?.map((path: any) => 
              `Consider pursuing ${path.title} - ${path.description}`
            ) || []
          }
        }

        // Fetch additional market insights
        try {
          const marketResponse = await fetch('/api/ai-enhanced/market/insights?fields=' + preferences.preferred_fields.join(','))
          if (marketResponse.ok) {
            const marketData = await marketResponse.json()
            
            // Enhance career paths with market data
            if (marketData.market_overview?.trending_fields) {
              transformedData.careerPaths = transformedData.careerPaths.map(career => {
                const matchingTrend = marketData.market_overview.trending_fields.find((trend: any) => 
                  trend.field.toLowerCase().includes(career.title.toLowerCase()) ||
                  career.title.toLowerCase().includes(trend.field.toLowerCase())
                )
                
                if (matchingTrend) {
                  return {
                    ...career,
                    averageSalary: matchingTrend.avg_salary || career.averageSalary,
                    requiredSkills: matchingTrend.hot_skills || career.requiredSkills,
                    topColleges: ['IIT', 'NIT', 'Top Universities'],
                    jobRoles: [`${career.title} Engineer`, `${career.title} Specialist`, `${career.title} Analyst`]
                  }
                }
                return career
              })
            }
          }
        } catch (marketError) {
          console.log('Market data not available, using defaults')
        }

        setAIRecommendations(transformedData)
        setStep(4)
      } else {
        throw new Error('Failed to get AI recommendations')
      }

    } catch (error) {
      console.error('Error generating AI recommendations:', error)
      
      // Fallback to basic recommendations
      const basicRecommendations = generateBasicRecommendations()
      setAIRecommendations(basicRecommendations)
      setStep(4)
    } finally {
      setLoading(false)
    }
  }
        setAIRecommendations(basicRecommendations)
        setStep(4)
      }
    } catch (error) {
      console.error('Error generating recommendations:', error)
      // Fallback to basic recommendations
      const basicRecommendations = generateBasicRecommendations()
      setAIRecommendations(basicRecommendations)
      setStep(4)
    } finally {
      setLoading(false)
    }
  }

  const generateBasicRecommendations = (): AIRecommendations => {
    return {
      courseRecommendations: [
        {
          title: "Computer Science Engineering",
          category: "Engineering",
          match_percentage: 85,
          reasons: ["High interest in technology", "Strong logical reasoning"],
          career_prospects: ["Software Engineer", "Data Scientist", "AI Specialist"],
          salary_range: "INR 6-15 LPA"
        },
        {
          title: "Business Administration",
          category: "Business",
          match_percentage: 75,
          reasons: ["Interest in business", "Good verbal reasoning"],
          career_prospects: ["Business Analyst", "Product Manager", "Consultant"],
          salary_range: "INR 5-12 LPA"
        }
      ],
      collegeRecommendations: [
        {
          name: "Indian Institute of Technology Delhi",
          type: "Government",
          location: "New Delhi, Delhi",
          match_percentage: 90,
          reasons: ["Top engineering institute", "Excellent placement record"],
          specializations: ["Computer Science", "Mechanical Engineering"]
        },
        {
          name: "All India Institute of Medical Sciences",
          type: "Government",
          location: "New Delhi, Delhi",
          match_percentage: 85,
          reasons: ["Premier medical institute", "Research opportunities"],
          specializations: ["MBBS", "Medical Research"]
        }
      ],
      careerPath: {
        immediate_steps: [
          "Complete your 12th grade with good scores",
          "Prepare for entrance exams like JEE or NEET",
          "Develop relevant skills through online courses"
        ],
        short_term_goals: [
          "Secure admission in a top college",
          "Build a strong foundation in your chosen field",
          "Participate in internships and projects"
        ],
        long_term_vision: "Build a successful career in your chosen field with opportunities for growth and impact.",
        skills_to_develop: [
          "Technical skills relevant to your field",
          "Communication and leadership skills",
          "Problem-solving abilities",
          "Continuous learning mindset"
        ]
      },
      personalizedAdvice: "Based on your profile and interests, focus on building strong fundamentals and exploring multiple career paths before making a final decision."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
            >
              <Brain className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analyzing Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Our AI is processing your information to generate personalized career recommendations...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="bg-blue-600 h-2 rounded-full"
              ></motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (step === 4 && aiRecommendations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your AI-Powered Career Roadmap</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Based on your profile, interests, and aptitude, here are personalized recommendations to help you achieve your career goals.
            </p>
          </motion.div>

          {/* Course Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
              Recommended Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiRecommendations.courseRecommendations.map((course, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {course.match_percentage}% Match
                    </span>
                  </div>
                  <p className="text-blue-600 font-medium mb-3">{course.category}</p>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Why this fits you:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {course.reasons.map((reason, reasonIndex) => (
                        <li key={reasonIndex} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Career Prospects:</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.career_prospects.map((prospect, prospectIndex) => (
                        <span key={prospectIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {prospect}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">{course.salary_range}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* College Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-blue-600" />
              Recommended Colleges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiRecommendations.collegeRecommendations.map((college, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{college.name}</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {college.match_percentage}% Match
                    </span>
                  </div>
                  <div className="flex items-center mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded mr-2">{college.type}</span>
                    <span className="text-gray-600 text-sm">{college.location}</span>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Why this college:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {college.reasons.map((reason, reasonIndex) => (
                        <li key={reasonIndex} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specializations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {college.specializations.map((spec, specIndex) => (
                        <span key={specIndex} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Career Path */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-600" />
              Your Career Roadmap
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Immediate Steps
                </h3>
                <ul className="space-y-2">
                  {aiRecommendations.careerPath.immediate_steps.map((step, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                  Short-term Goals
                </h3>
                <ul className="space-y-2">
                  {aiRecommendations.careerPath.short_term_goals.map((goal, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-purple-600" />
                  Skills to Develop
                </h3>
                <ul className="space-y-2">
                  {aiRecommendations.careerPath.skills_to_develop.map((skill, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Long-term Vision</h3>
                <p className="text-sm text-gray-600">{aiRecommendations.careerPath.long_term_vision}</p>
              </div>
            </div>
          </motion.div>

          {/* Personalized Advice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-3" />
              AI Advisor's Personalized Guidance
            </h2>
            <p className="text-lg leading-relaxed mb-6">{aiRecommendations.personalizedAdvice}</p>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Retake Assessment
              </button>
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors">
                Explore Courses
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <span className="text-gray-600">
              Step {step} of 3: {
                step === 1 ? 'Personal Information' :
                step === 2 ? 'Interests & Preferences' :
                'Generate Recommendations'
              }
            </span>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={userProfile.age}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Education</label>
                    <select
                      value={userProfile.education}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, education: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="10th Grade">10th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={userProfile.location}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your city, state"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Interests</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interests.map(interest => (
                      <button
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          userProfile.interests.includes(interest)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!userProfile.name || userProfile.interests.length === 0}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Preferences</h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Preferred Fields</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {preferredFields.map(field => (
                      <button
                        key={field}
                        onClick={() => handlePreferenceToggle(field, 'fields')}
                        className={`p-3 rounded-lg border-2 transition-colors text-left ${
                          preferences.preferred_fields.includes(field)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {field}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Career Priorities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {careerPriorities.map(priority => (
                      <button
                        key={priority}
                        onClick={() => handlePreferenceToggle(priority, 'priorities')}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          preferences.career_priorities.includes(priority)
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location Preference</label>
                    <input
                      type="text"
                      value={preferences.location_preference}
                      onChange={(e) => setPreferences(prev => ({ ...prev, location_preference: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any specific location preference?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <select
                      value={preferences.budget_range}
                      onChange={(e) => setPreferences(prev => ({ ...prev, budget_range: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under 1 Lakh">Under ₹1 Lakh</option>
                      <option value="1-5 Lakhs">₹1-5 Lakhs</option>
                      <option value="5-15 Lakhs">₹5-15 Lakhs</option>
                      <option value="15+ Lakhs">₹15+ Lakhs</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={preferences.preferred_fields.length === 0}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Generate AI Recommendations
                  <Brain className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Brain className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready for AI Analysis?</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Our advanced AI system will analyze your profile, interests, and preferences to generate personalized career and educational recommendations tailored specifically for you.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">What you'll get:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                    Personalized course recommendations
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    Best-fit college suggestions
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-blue-600" />
                    Detailed career roadmap
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                    Skills development plan
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Edit
                </button>
                <button
                  onClick={generateAIRecommendations}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center font-medium"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Recommendations
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
