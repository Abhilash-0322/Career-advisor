'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface Course {
  _id: string
  title: string
  description: string
  category: string
  duration: string
  level: string
  prerequisites: string[]
  skills: string[]
  rating?: number
  enrollmentCount?: number
  isAIRecommended?: boolean
  aiRecommendationReason?: string
  aiConfidenceScore?: number
}

interface UserProfile {
  academicProfile: {
    educationLevel: string
    grades: { [key: string]: string }
    gpa?: number
    standardizedTestScores: { [key: string]: number }
  }
  careerProfile: {
    goals: string[]
    interestedIndustries: string[]
    preferredWorkStyle: string
    salaryExpectations?: string
    careerStage: string
  }
  skillsProfile: {
    technicalSkills: string[]
    softSkills: string[]
    certifications: string[]
    languages: string[]
    skillGaps: string[]
  }
  interests: string[]
  educationLevel: string
  location?: string
}

export default function CoursesPage() {
  const { data: session } = useSession()
  const [courses, setCourses] = useState<Course[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [profileForm, setProfileForm] = useState<Partial<UserProfile>>({
    academicProfile: {
      educationLevel: '',
      grades: {},
      standardizedTestScores: {}
    },
    careerProfile: {
      goals: [],
      interestedIndustries: [],
      preferredWorkStyle: '',
      careerStage: ''
    },
    skillsProfile: {
      technicalSkills: [],
      softSkills: [],
      certifications: [],
      languages: [],
      skillGaps: []
    },
    interests: [],
    educationLevel: ''
  })

  const categories = [
    'Programming',
    'Data Science', 
    'Web Development',
    'Mobile Development',
    'Artificial Intelligence',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps',
    'UI/UX Design',
    'Business Analytics'
  ]

  const levels = ['Beginner', 'Intermediate', 'Advanced']

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Government', 'Non-profit', 'Media', 'Gaming',
    'Telecommunications', 'Energy', 'Transportation', 'Real Estate'
  ]

  const commonSkills = [
    'Python', 'JavaScript', 'Java', 'React', 'Node.js', 'SQL', 'Machine Learning',
    'Data Analysis', 'Cloud Computing', 'Project Management', 'Communication',
    'Leadership', 'Problem Solving', 'Critical Thinking', 'Teamwork'
  ]

  useEffect(() => {
    fetchCourses()
    if (session?.user) {
      fetchUserProfile()
    }
  }, [session])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/courses')
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }
      
      const data = await response.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      setError('Failed to load courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.profile)
        setProfileForm(data.profile)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const updateUserProfile = async () => {
    try {
      setProfileLoading(true)
      setError('')

      // Basic validation
      if (!profileForm.academicProfile?.educationLevel) {
        setError('Please select your education level')
        return
      }

      if (!profileForm.careerProfile?.careerStage) {
        setError('Please select your career stage')
        return
      }

      console.log('Submitting profile data:', profileForm)

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Profile updated successfully:', data)
        setUserProfile(data.profile)
        setShowProfileForm(false)
        
        // Refresh courses to get new AI recommendations
        await fetchCourses()
        
        if (data.aiAnalysisTriggered) {
          setError('✅ Profile updated! AI recommendations will be refreshed shortly.')
        } else {
          setError('✅ Profile updated successfully!')
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Error response:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(`Failed to update profile: ${errorMessage}`)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleSkillToggle = (skill: string, field: 'technicalSkills' | 'softSkills' | 'skillGaps') => {
    setProfileForm(prev => ({
      ...prev,
      skillsProfile: {
        ...prev.skillsProfile!,
        [field]: prev.skillsProfile![field]?.includes(skill)
          ? prev.skillsProfile![field].filter(s => s !== skill)
          : [...(prev.skillsProfile![field] || []), skill]
      }
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setProfileForm(prev => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...(prev.interests || []), interest]
    }))
  }

  const handleIndustryToggle = (industry: string) => {
    setProfileForm(prev => ({
      ...prev,
      careerProfile: {
        ...prev.careerProfile!,
        interestedIndustries: prev.careerProfile!.interestedIndustries?.includes(industry)
          ? prev.careerProfile!.interestedIndustries.filter(i => i !== industry)
          : [...(prev.careerProfile!.interestedIndustries || []), industry]
      }
    }))
  }

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory
    const levelMatch = selectedLevel === 'all' || course.level === selectedLevel
    return categoryMatch && levelMatch
  })

  const aiRecommendedCourses = courses.filter(course => course.isAIRecommended)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading courses...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Courses</h1>
          <p className="text-xl text-gray-600">
            Explore our comprehensive course catalog and get personalized AI recommendations based on your profile.
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 border rounded-lg ${
            error.includes('✅') 
              ? 'bg-green-100 border-green-400 text-green-700'
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Profile Setup Section */}
        {session && (
          <div className="mb-8">
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">👤</span>
                  Your Learning Profile
                </CardTitle>
                <CardDescription>
                  Complete your profile to get personalized AI-powered course recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Debug info - remove in production */}
                <div className="text-xs text-gray-500 mb-2 flex justify-between items-center">
                  <span>Session: {session.user?.email} | Profile: {userProfile ? 'Loaded' : 'Not loaded'}</span>
                  <button 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/user/reset-profile', { method: 'POST' })
                        if (response.ok) {
                          setUserProfile(null)
                          setError('Profile reset successfully. Please refresh the page.')
                        }
                      } catch (error) {
                        setError('Failed to reset profile')
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-xs underline"
                  >
                    Reset Profile
                  </button>
                </div>
                
                {!userProfile || !userProfile.academicProfile?.educationLevel ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">
                      Set up your learning profile to get personalized course recommendations
                    </p>
                    <Button onClick={() => setShowProfileForm(true)}>
                      Complete Your Profile
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Education: {userProfile.academicProfile.educationLevel} | 
                        Career Stage: {userProfile.careerProfile.careerStage} |
                        Skills: {userProfile.skillsProfile.technicalSkills?.length || 0} technical
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowProfileForm(true)}>
                      Update Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Show login prompt if not authenticated */}
        {!session && (
          <div className="mb-8">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">🔒</span>
                  Sign In Required
                </CardTitle>
                <CardDescription>
                  Please sign in to access AI-powered course recommendations and save your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => window.location.href = '/auth/signin'}>
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Form Modal */}
        {showProfileForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto p-6 w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Complete Your Learning Profile</h2>
                <Button variant="outline" onClick={() => setShowProfileForm(false)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Academic Profile */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Academic Background</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Education Level</label>
                      <select
                        value={profileForm.academicProfile?.educationLevel || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          academicProfile: { ...prev.academicProfile!, educationLevel: e.target.value },
                          educationLevel: e.target.value
                        }))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Education Level</option>
                        <option value="High School">High School</option>
                        <option value="Bachelor's">Bachelor's Degree</option>
                        <option value="Master's">Master's Degree</option>
                        <option value="PhD">PhD</option>
                        <option value="Diploma">Diploma/Certificate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">GPA (if applicable)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={profileForm.academicProfile?.gpa || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          academicProfile: { ...prev.academicProfile!, gpa: parseFloat(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="3.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Career Profile */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Career Goals</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Career Stage</label>
                      <select
                        value={profileForm.careerProfile?.careerStage || ''}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          careerProfile: { ...prev.careerProfile!, careerStage: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Career Stage</option>
                        <option value="Student">Student</option>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid-Level">Mid-Level</option>
                        <option value="Senior Level">Senior Level</option>
                        <option value="Career Change">Career Change</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Interested Industries</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {industries.map(industry => (
                          <label key={industry} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={profileForm.careerProfile?.interestedIndustries?.includes(industry) || false}
                              onChange={() => handleIndustryToggle(industry)}
                              className="rounded"
                            />
                            <span className="text-sm">{industry}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Profile */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Skills & Interests</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Technical Skills</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {commonSkills.filter(skill => 
                          ['Python', 'JavaScript', 'Java', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Analysis', 'Cloud Computing'].includes(skill)
                        ).map(skill => (
                          <label key={skill} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={profileForm.skillsProfile?.technicalSkills?.includes(skill) || false}
                              onChange={() => handleSkillToggle(skill, 'technicalSkills')}
                              className="rounded"
                            />
                            <span className="text-sm">{skill}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Skills You Want to Learn</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {commonSkills.map(skill => (
                          <label key={skill} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={profileForm.skillsProfile?.skillGaps?.includes(skill) || false}
                              onChange={() => handleSkillToggle(skill, 'skillGaps')}
                              className="rounded"
                            />
                            <span className="text-sm">{skill}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Areas of Interest</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categories.map(interest => (
                          <label key={interest} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={profileForm.interests?.includes(interest) || false}
                              onChange={() => handleInterestToggle(interest)}
                              className="rounded"
                            />
                            <span className="text-sm">{interest}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button variant="outline" onClick={() => setShowProfileForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={updateUserProfile} disabled={profileLoading}>
                    {profileLoading ? 'Saving...' : 'Save Profile & Get AI Recommendations'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Recommended Courses Section */}
        {session && aiRecommendedCourses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🤖</span>
              AI Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiRecommendedCourses.slice(0, 6).map((course) => (
                <Card key={course._id} className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <div className="flex flex-col items-end">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs mb-1">
                          AI Pick
                        </span>
                        {course.aiConfidenceScore && (
                          <span className="text-xs text-blue-600">
                            {Math.round(course.aiConfidenceScore * 100)}% match
                          </span>
                        )}
                      </div>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                    {course.aiRecommendationReason && (
                      <div className="bg-blue-100 p-2 rounded text-xs text-blue-800 mt-2">
                        <strong>Why recommended:</strong> {course.aiRecommendationReason}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{course.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-medium">{course.level}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      {course.rating && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Rating:</span>
                          <span className="font-medium">⭐ {course.rating}/5</span>
                        </div>
                      )}
                    </div>
                    
                    {course.skills && course.skills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Skills you'll learn:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                          {course.skills.length > 3 && (
                            <span className="text-gray-500 text-xs">+{course.skills.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full mt-4">
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* All Courses */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Courses ({filteredCourses.length})</h2>
          
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{course.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-medium">{course.level}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      {course.rating && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Rating:</span>
                          <span className="font-medium">⭐ {course.rating}/5</span>
                        </div>
                      )}
                      {course.enrollmentCount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Students:</span>
                          <span className="font-medium">{course.enrollmentCount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.prerequisites.map((prereq, index) => (
                            <span key={index} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                              {prereq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {course.skills && course.skills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Skills you'll learn:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                          {course.skills.length > 3 && (
                            <span className="text-gray-500 text-xs">+{course.skills.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full mt-4">
                      Enroll Now
                    </Button>
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
