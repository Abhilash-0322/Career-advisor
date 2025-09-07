'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Course {
  _id: string
  title: string
  description: string
  category: string
  duration: string
  level?: string
  code?: string
  careerProspects?: string[]
  prerequisites?: string[]
  skills?: string[]
  rating?: number
  enrollmentCount?: number
  isAIRecommended?: boolean
  aiRecommendationReason?: string
  provider?: string
  estimatedCost?: string
  matchPercentage?: number
  averageSalary?: number
  topRecruiters?: string[]
  isEnhanced?: boolean
}

export default function CoursesPage() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [recommendations, setRecommendations] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')

  const categories = [
    'Programming', 'Data Science', 'Web Development', 'Mobile Development',
    'Artificial Intelligence', 'Machine Learning', 'Cybersecurity', 'Cloud Computing',
    'DevOps', 'UI/UX Design', 'Business Analytics', 'Blockchain'
  ]

  const levels = ['Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    fetchCourses()
    if (session) {
      fetchUserRecommendations()
    }
  }, [selectedCategory, selectedLevel, session])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedLevel !== 'all') params.append('difficulty', selectedLevel)
      
      const response = await fetch(`/api/courses?${params}`)
      if (response.ok) {
        const data = await response.json()
        // Extract courses array from the response
        const coursesArray = data.courses || data || []
        setCourses(Array.isArray(coursesArray) ? coursesArray : [])
      } else {
        setCourses([])
      }
    } catch (error) {
      setError('Failed to fetch courses')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRecommendations = async () => {
    try {
      const response = await fetch('/api/user/recommendations', {
        method: 'GET'
      })

      if (response.ok) {
        const data = await response.json()
        const persistedRecommendations = data.recommendations || []
        
        if (persistedRecommendations.length > 0) {
          // Convert persisted recommendations to Course format
          const formattedRecommendations = persistedRecommendations.map((rec: any, index: number) => ({
            _id: `persisted_${index}`,
            title: rec.title,
            description: rec.reasoning || 'AI-recommended course based on your profile',
            category: rec.category || 'AI Recommended',
            duration: rec.estimated_duration || rec.duration || 'Variable',
            level: rec.level || rec.difficulty_level,
            provider: rec.provider,
            estimatedCost: rec.cost || rec.estimated_cost,
            matchPercentage: rec.match_percentage,
            skills: rec.skills_gained || [],
            rating: rec.rating,
            enrollmentCount: rec.enrollments,
            isAIRecommended: true,
            aiRecommendationReason: rec.reasoning,
            isEnhanced: true
          }))
          
          setRecommendations(formattedRecommendations)
          setError('')
        }
      }
    } catch (error) {
      console.error('Error fetching user recommendations:', error)
    }
  }

  const handleGetRecommendations = async () => {
    if (!session) {
      setError('Please sign in to get recommendations')
      return
    }

    setIsLoadingRecommendations(true)
    setError('')

    try {
      // Force refresh recommendations
      const response = await fetch('/api/user/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRefresh: true })
      })

      if (response.ok) {
        const data = await response.json()
        const newRecommendations = data.recommendations || []
        
        const formattedRecommendations = newRecommendations.map((rec: any, index: number) => ({
          _id: `new_${index}`,
          title: rec.title,
          description: rec.reasoning || 'AI-recommended course based on your profile',
          category: rec.category || 'AI Recommended',
          duration: rec.estimated_duration || rec.duration || 'Variable',
          level: rec.level || rec.difficulty_level,
          provider: rec.provider,
          estimatedCost: rec.cost || rec.estimated_cost,
          matchPercentage: rec.match_percentage,
          skills: rec.skills_gained || [],
          rating: rec.rating,
          enrollmentCount: rec.enrollments,
          isAIRecommended: true,
          aiRecommendationReason: rec.reasoning
        }))
        
        setRecommendations(formattedRecommendations)
        setError(`✅ Generated ${formattedRecommendations.length} fresh AI recommendations!`)
      } else {
        setError('Failed to generate recommendations. Please update your profile first.')
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setError('Error loading recommendations')
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const filteredCourses = Array.isArray(courses) ? courses.filter(course => {
    const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory
    const levelMatch = selectedLevel === 'all' || !course.level || course.level === selectedLevel
    return categoryMatch && levelMatch
  }) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Your Perfect Courses</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive course catalog and get personalized AI recommendations based on your profile.
          </p>
        </div>

        {session ? (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <h3 className="text-xl font-semibold mb-3">🎯 Get AI-Powered Course Recommendations</h3>
            <p className="mb-4">Set up your learning profile to get personalized course suggestions based on your interests, goals, and skill level.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/profile-setup" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Set Up Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔒 Sign In Required</h3>
            <p className="text-yellow-700">Please sign in to access AI-powered course recommendations and save your profile.</p>
          </div>
        )}

        {error && (
          <div className={`mb-6 p-4 rounded-lg ${
            error.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {error}
          </div>
        )}

        {/* Personalized AI Recommendations */}
        {session && recommendations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">🎯 Your Personalized Recommendations</h2>
              <button
                onClick={handleGetRecommendations}
                disabled={isLoadingRecommendations}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoadingRecommendations ? 'Refreshing...' : 'Refresh Recommendations'}
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((course, index) => (
                <Card key={`rec-${index}`} className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      {course.matchPercentage && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {course.matchPercentage}% Match
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      <span className="font-medium text-purple-600">{course.provider || 'AI Curated'}</span>
                      {course.estimatedCost && <span className="ml-2 text-green-600">• {course.estimatedCost}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3 line-clamp-3">{course.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      {course.level && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Level:</span>
                          <span className="font-medium">{course.level}</span>
                        </div>
                      )}
                      {course.rating && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rating:</span>
                          <span className="font-medium">⭐ {course.rating}/5</span>
                        </div>
                      )}
                    </div>

                    {course.aiRecommendationReason && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Why recommended:</strong> {course.aiRecommendationReason}
                        </p>
                      </div>
                    )}

                    {course.skills && course.skills.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Skills you'll gain:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Filter Courses</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* All Courses */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {session && recommendations.length > 0 ? 'Browse More Courses' : 'All Courses'}
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No courses found matching your filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>
                      {course.category}
                      {course.level && ` • ${course.level}`}
                      {course.duration && ` • ${course.duration}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 line-clamp-3">{course.description}</p>
                    
                    {course.careerProspects && course.careerProspects.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">Career Prospects:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.careerProspects.slice(0, 3).map((prospect, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {prospect}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {course.skills && course.skills.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(course.averageSalary && course.averageSalary > 0 || course.topRecruiters?.length) && (
                      <div className="text-sm text-gray-600 space-y-1">
                        {course.averageSalary && course.averageSalary > 0 && (
                          <p>Average Salary: ₹{course.averageSalary.toLocaleString()}</p>
                        )}
                        {course.topRecruiters && course.topRecruiters.length > 0 && (
                          <p>Top Recruiters: {course.topRecruiters.slice(0, 2).join(', ')}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
