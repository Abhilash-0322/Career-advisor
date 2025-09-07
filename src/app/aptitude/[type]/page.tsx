'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { aptitudeQuestions } from '@/data/sampleData'

interface Question {
  id: string
  type: string
  category: string
  question: string
  options: { value: number; text: string }[]
}

interface TestPageProps {
  params: {
    type: string
  }
}

export default function TestPage({ params }: TestPageProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({})
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const testTypes = {
    personality: 'Personality Assessment',
    intelligence: 'Intelligence Test', 
    interest: 'Interest Inventory',
    skill: 'Skill Assessment'
  }

  useEffect(() => {
    // Filter questions by test type
    const filteredQuestions = aptitudeQuestions.filter(q => q.type === params.type)
    setQuestions(filteredQuestions)
    setIsLoading(false)
    setQuestionStartTime(Date.now())
  }, [params.type])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswer = (answer: string) => {
    const currentTime = Date.now()
    const timeForQuestion = currentTime - questionStartTime
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
    
    setTimeSpent(prev => ({
      ...prev,
      [currentQuestion.id]: timeForQuestion
    }))
  }

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setQuestionStartTime(Date.now())
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setQuestionStartTime(Date.now())
    }
  }

  const submitTest = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setIsSubmitting(true)

    try {
      const responses = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || '',
        timeSpent: timeSpent[q.id] || 0
      }))

      const response = await fetch('/api/aptitude/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: params.type,
          responses
        }),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/aptitude/results/${result.id}`)
      } else {
        throw new Error('Failed to submit test')
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      alert('Failed to submit test. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Assessment Complete!</h2>
            <p className="text-gray-600 mb-6">
              You've answered all questions. Click submit to get your results.
            </p>
            <Button 
              onClick={submitTest} 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasAnswered = answers[currentQuestion.id] !== undefined

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {testTypes[params.type as keyof typeof testTypes]}
          </h1>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}% Complete</p>
        </div>

        {/* Question Card */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.text)}
                  className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                    answers[currentQuestion.id] === option.text
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[currentQuestion.id] === option.text
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion.id] === option.text && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={() => setCurrentQuestionIndex(questions.length)}
                  disabled={!hasAnswered}
                  className="flex items-center"
                >
                  Complete Assessment
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={goToNext}
                  disabled={!hasAnswered}
                  className="flex items-center"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <div className="max-w-4xl mx-auto mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Answered: {Object.keys(answers).length}/{questions.length}</span>
                <span>Remaining: {questions.length - Object.keys(answers).length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
