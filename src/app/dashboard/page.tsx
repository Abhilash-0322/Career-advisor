'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Award, 
  MapPin, 
  Clock,
  ChevronRight,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface DashboardData {
  user: {
    name: string
    email: string
    profileCompletion: number
    lastActive: string
  }
  aptitudeResults: {
    _id: string
    testType: string
    completedAt: string
    results: {
      scores: { category: string; score: number }[]
      recommendations: {
        streams: string[]
        careerPaths: string[]
      }
    }
  }[]
  recommendations: {
    courses: any[]
    colleges: any[]
    careerPaths: string[]
  }
  upcomingDeadlines: {
    title: string
    date: string
    type: string
  }[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchDashboardData()
  }, [session, status])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const getTestTypeLabel = (type: string) => {
    const labels = {
      personality: 'Personality',
      intelligence: 'Intelligence',
      interest: 'Interest',
      skill: 'Skill'
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session?.user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600">
            Here's your personalized career guidance dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Profile Completion
                </CardTitle>
                <CardDescription>
                  Complete your profile to get better recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Profile Completion</span>
                    <span className="font-medium">{dashboardData?.user.profileCompletion || 60}%</span>
                  </div>
                  <Progress value={dashboardData?.user.profileCompletion || 60} />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => router.push('/aptitude')}>
                      Take Aptitude Test
                    </Button>
                    <Button size="sm" variant="outline">
                      Update Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Your Assessment Results
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => router.push('/aptitude')}
                  >
                    Take More Tests
                    <Plus className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.aptitudeResults?.length ? (
                  <div className="space-y-4">
                    {dashboardData.aptitudeResults.slice(0, 3).map((result) => (
                      <div 
                        key={result._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/aptitude/results/${result._id}`)}
                      >
                        <div>
                          <h4 className="font-medium">{getTestTypeLabel(result.testType)} Assessment</h4>
                          <p className="text-sm text-gray-600">
                            Completed {new Date(result.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-3">
                            <div className="font-medium text-green-600">
                              {result.results.scores[0]?.score || 0}%
                            </div>
                            <div className="text-xs text-gray-500">Top Score</div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No assessments yet</h3>
                    <p className="text-gray-600 mb-4">
                      Take your first aptitude test to get personalized recommendations
                    </p>
                    <Button onClick={() => router.push('/aptitude')}>
                      Start Assessment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                  Recommended Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Computer Science Engineering',
                    'Data Science',
                    'Software Engineering',
                    'Artificial Intelligence'
                  ].map((course, index) => (
                    <div 
                      key={index}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push('/courses')}
                    >
                      <h4 className="font-medium mb-2">{course}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>4 Years</span>
                        <span>95% Match</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/courses')}
                  >
                    View All Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push('/aptitude')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Take Assessment
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push('/courses')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push('/colleges')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Colleges
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push('/timeline')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Timeline
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: 'JEE Main Registration', date: '2025-01-15', type: 'exam' },
                    { title: 'NEET Application', date: '2025-02-01', type: 'exam' },
                    { title: 'Scholarship Deadline', date: '2025-01-30', type: 'scholarship' }
                  ].map((deadline, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{deadline.title}</div>
                        <div className="text-xs text-gray-600">{deadline.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => router.push('/timeline')}
                >
                  View All Deadlines
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span>Completed Personality Assessment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    <span>Viewed Computer Science courses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span>Added IIT Delhi to favorites</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  )
}
