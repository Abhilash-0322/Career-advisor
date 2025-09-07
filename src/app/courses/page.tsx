'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FuturisticHeader } from '@/components/layout/futuristic-header'
import { FuturisticFooter } from '@/components/layout/futuristic-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Zap, 
  BookOpen, 
  Star, 
  TrendingUp, 
  Filter,
  RefreshCw,
  Brain,
  Target,
  Clock,
  Award
} from 'lucide-react'

interface Course {
  _id: string
  title: string
  description: string
  category: string
  duration: string
  level?: string
  code?: string
  careerProspects?: (string | { role: string; averageSalary?: number; growthRate?: string; _id?: string })[]
  prerequisites?: string[]
  skills?: (string | { name: string; _id?: string })[]
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      <FuturisticHeader />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative container mx-auto px-4 py-24">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">AI-Powered Course Discovery</span>
          </motion.div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
            Discover Your
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Perfect Courses
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive course catalog and get personalized AI recommendations 
            tailored to your unique learning journey and career aspirations.
          </p>
        </motion.div>

        {/* AI Recommendations Section */}
        {session ? (
          <motion.div 
            className="mb-16 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI-Powered Recommendations</h3>
              </div>
              
              <p className="text-gray-300 mb-6 text-lg">
                Set up your learning profile to get personalized course suggestions based on your 
                interests, goals, and skill level powered by advanced AI algorithms.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/profile-setup">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                    <Target className="w-4 h-4 mr-2" />
                    Set Up Profile
                  </Button>
                </Link>
                
                {recommendations.length > 0 && (
                  <Button
                    onClick={handleGetRecommendations}
                    disabled={isLoadingRecommendations}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  >
                    {isLoadingRecommendations ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 mr-2" />
                    )}
                    {isLoadingRecommendations ? 'Refreshing...' : 'Refresh Recommendations'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Sign In Required
              </h3>
              <p className="text-gray-300">
                Please sign in to access AI-powered course recommendations and save your learning profile.
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Messages */}
        {error && (
          <motion.div 
            className={`mb-8 p-4 rounded-2xl backdrop-blur-xl border ${
              error.includes('✅') 
                ? 'bg-green-500/10 text-green-300 border-green-500/20' 
                : 'bg-red-500/10 text-red-300 border-red-500/20'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {/* Personalized AI Recommendations */}
        {session && recommendations.length > 0 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Target className="w-8 h-8 text-purple-400" />
                </div>
                Your Personalized Recommendations
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((course, index) => (
                <motion.div
                  key={`rec-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg text-white">{course.title}</CardTitle>
                        {course.matchPercentage && (
                          <motion.span 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                            whileHover={{ scale: 1.1 }}
                          >
                            {course.matchPercentage}% Match
                          </motion.span>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        <span className="font-medium text-purple-300">{course.provider || 'AI Curated'}</span>
                        {course.estimatedCost && (
                          <span className="ml-2 text-green-400">• {course.estimatedCost}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4 line-clamp-3">{course.description}</p>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Duration:
                          </span>
                          <span className="font-medium text-white">{course.duration}</span>
                        </div>
                        {course.level && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Level:
                            </span>
                            <span className="font-medium text-white">{course.level}</span>
                          </div>
                        )}
                        {course.rating && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Rating:
                            </span>
                            <span className="font-medium text-white flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              {course.rating}/5
                            </span>
                          </div>
                        )}
                      </div>

                      {course.aiRecommendationReason && (
                        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <p className="text-sm text-blue-300">
                            <strong className="flex items-center gap-1 mb-1">
                              <Brain className="w-3 h-3" />
                              Why recommended:
                            </strong>
                            {course.aiRecommendationReason}
                          </p>
                        </div>
                      )}

                      {course.skills && course.skills.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Skills you'll gain:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {course.skills.slice(0, 4).map((skill, idx) => (
                              <span 
                                key={idx} 
                                className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg text-xs border border-purple-500/30"
                              >
                                {typeof skill === 'string' ? skill : skill?.name || 'Skill'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Filter className="w-6 h-6 text-blue-400" />
              Filter Courses
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                >
                  <option value="all">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Courses */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            {session && recommendations.length > 0 ? 'Browse More Courses' : 'All Courses'}
          </h2>
          
          {loading ? (
            <div className="text-center py-16">
              <motion.div 
                className="inline-block w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-gray-300 text-lg">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-500/20 rounded-2xl w-fit mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">No courses found matching your filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 h-full">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">{course.title}</CardTitle>
                      <CardDescription className="text-gray-300">
                        {course.category}
                        {course.level && <span className="text-blue-400"> • {course.level}</span>}
                        {course.duration && <span className="text-purple-400"> • {course.duration}</span>}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4 line-clamp-3">{course.description}</p>
                      
                      {course.careerProspects && course.careerProspects.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-white mb-2 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Career Prospects:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {course.careerProspects.slice(0, 3).map((prospect, idx) => (
                              <span 
                                key={idx} 
                                className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-xs border border-blue-500/30"
                              >
                                {typeof prospect === 'string' ? prospect : prospect?.role || 'Career Role'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {course.skills && course.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-white mb-2 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Skills:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {course.skills.slice(0, 4).map((skill, idx) => (
                              <span 
                                key={idx} 
                                className="bg-green-500/20 text-green-300 px-2 py-1 rounded-lg text-xs border border-green-500/30"
                              >
                                {typeof skill === 'string' ? skill : skill?.name || 'Skill'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(course.averageSalary && course.averageSalary > 0 || course.topRecruiters?.length) && (
                        <div className="text-sm text-gray-400 space-y-2 pt-4 border-t border-gray-700/50">
                          {course.averageSalary && course.averageSalary > 0 && (
                            <p className="flex items-center gap-2">
                              <span className="text-green-400">💰</span>
                              Average Salary: ₹{course.averageSalary.toLocaleString()}
                            </p>
                          )}
                          {course.topRecruiters && course.topRecruiters.length > 0 && (
                            <p className="flex items-center gap-2">
                              <span className="text-blue-400">🏢</span>
                              Top Recruiters: {course.topRecruiters.slice(0, 2).join(', ')}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <FuturisticFooter />
    </motion.div>
  )
}
