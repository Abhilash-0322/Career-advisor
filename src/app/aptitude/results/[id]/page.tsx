'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Download, Share2, TrendingUp, Award, BookOpen, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ResultsPageProps {
  params: {
    id: string
  }
}

interface AptitudeResult {
  _id: string
  testType: string
  results: {
    scores: {
      category: string
      score: number
      percentile: number
    }[]
    recommendations: {
      streams: string[]
      courses: string[]
      careerPaths: string[]
    }
    personality?: {
      type: string
      traits: string[]
      strengths: string[]
      challenges: string[]
    }
  }
  completedAt: string
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [result, setResult] = useState<AptitudeResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const testTypeNames = {
    personality: 'Personality Assessment',
    intelligence: 'Intelligence Test',
    interest: 'Interest Inventory',
    skill: 'Skill Assessment'
  }

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchResults()
  }, [session, status, params.id])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/aptitude/results/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch results')
      }
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setError('Failed to load results. Please try again.')
      console.error('Error fetching results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Average'
    return 'Needs Improvement'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Results not found'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {testTypeNames[result.testType as keyof typeof testTypeNames]} Results
            </h1>
            <p className="text-gray-600">
              Completed on {new Date(result.completedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scores Section */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Your Scores
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of your performance in different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.results.scores.map((score, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">{score.category}</span>
                        <div className="text-right">
                          <span className={`font-bold text-lg ${getScoreColor(score.score)}`}>
                            {score.score}%
                          </span>
                          <div className="text-sm text-gray-500">
                            {getScoreLabel(score.score)} • {score.percentile}th percentile
                          </div>
                        </div>
                      </div>
                      <Progress value={score.score} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personality Insights (for personality tests) */}
            {result.results.personality && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-600" />
                    Personality Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3">Your Strengths</h4>
                      <ul className="space-y-2">
                        {result.results.personality.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                            <span className="capitalize">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-3">Key Traits</h4>
                      <ul className="space-y-2">
                        {result.results.personality.traits.map((trait, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                            <span className="capitalize">{trait}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recommendations Section */}
          <div className="space-y-6">
            {/* Stream Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                  Recommended Streams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.results.recommendations.streams.map((stream, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <span className="font-medium text-green-800 capitalize">{stream}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Paths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Career Paths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.results.recommendations.careerPaths.map((career, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <span className="font-medium text-blue-800">{career}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" onClick={() => router.push('/courses')}>
                    Explore Recommended Courses
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => router.push('/colleges')}>
                    Find Suitable Colleges
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard')}>
                    View Your Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
