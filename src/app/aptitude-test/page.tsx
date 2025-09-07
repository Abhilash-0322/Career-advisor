'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Timer, CheckCircle, XCircle, BarChart3, Brain, Target } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface Question {
  _id: string
  category: string
  subcategory: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
  timeLimit: number
}

interface TestResult {
  score: number
  totalQuestions: number
  categoryScores: Record<string, { correct: number; total: number }>
  timeSpent: number
  recommendations: string[]
}

export default function AptitudeTestPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    'Logical Reasoning',
    'Numerical Ability', 
    'Verbal Reasoning',
    'Spatial Reasoning',
    'Abstract Reasoning'
  ]

  useEffect(() => {
    fetchQuestions()
  }, [selectedCategory])

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (testStarted && timeLeft === 0) {
      handleNextQuestion()
    }
  }, [timeLeft, testStarted])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const categoryParam = selectedCategory === 'all' ? '' : `?category=${selectedCategory}`
      const response = await fetch(`/api/aptitude/questions${categoryParam}&limit=20`)
      const data = await response.json()
      
      if (data.success) {
        setQuestions(data.data)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const startTest = () => {
    if (questions.length === 0) return
    setTestStarted(true)
    setTimeLeft(questions[0]?.timeLimit || 120)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex]
    setAnswers(prev => ({
      ...prev,
      [currentQuestion._id]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setTimeLeft(questions[currentQuestionIndex + 1]?.timeLimit || 120)
    } else {
      completeTest()
    }
  }

  const completeTest = () => {
    setTestStarted(false)
    setTestCompleted(true)
    calculateResults()
  }

  const calculateResults = () => {
    let correctAnswers = 0
    const categoryScores: Record<string, { correct: number; total: number }> = {}

    questions.forEach((question) => {
      const category = question.category
      if (!categoryScores[category]) {
        categoryScores[category] = { correct: 0, total: 0 }
      }
      categoryScores[category].total++

      const userAnswer = answers[question._id]
      if (userAnswer === question.correctAnswer) {
        correctAnswers++
        categoryScores[category].correct++
      }
    })

    const score = Math.round((correctAnswers / questions.length) * 100)
    
    const recommendations = generateRecommendations(categoryScores, score)

    setTestResult({
      score,
      totalQuestions: questions.length,
      categoryScores,
      timeSpent: 0, // Calculate based on initial time vs remaining
      recommendations
    })
  }

  const generateRecommendations = (categoryScores: Record<string, { correct: number; total: number }>, overallScore: number): string[] => {
    const recommendations: string[] = []
    
    if (overallScore >= 80) {
      recommendations.push("Excellent performance! You show strong analytical and problem-solving abilities.")
    } else if (overallScore >= 60) {
      recommendations.push("Good performance with room for improvement in specific areas.")
    } else {
      recommendations.push("Consider focusing on developing fundamental reasoning skills.")
    }

    // Category-specific recommendations
    Object.entries(categoryScores).forEach(([category, scores]) => {
      const percentage = (scores.correct / scores.total) * 100
      if (percentage >= 80) {
        recommendations.push(`Strong in ${category} - consider careers that leverage this strength.`)
      } else if (percentage < 50) {
        recommendations.push(`Focus on improving ${category} skills through practice and training.`)
      }
    })

    return recommendations
  }

  const resetTest = () => {
    setTestStarted(false)
    setTestCompleted(false)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTestResult(null)
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (testCompleted && testResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h1>
              <p className="text-gray-600">Here are your results and recommendations</p>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Your Score</h2>
                <div className="text-5xl font-bold">{testResult.score}%</div>
                <p className="mt-2">Out of {testResult.totalQuestions} questions</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Performance by Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(testResult.categoryScores).map(([category, scores]) => {
                  const percentage = Math.round((scores.correct / scores.total) * 100)
                  return (
                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{category}</span>
                        <span className="text-sm text-gray-600">{scores.correct}/{scores.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 mt-1">{percentage}%</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {testResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-blue-900">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetTest}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Another Test
              </button>
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => {
                  // Navigate to recommendations or course exploration
                  window.location.href = '/courses'
                }}
              >
                Explore Recommended Courses
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <Brain className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Aptitude Assessment</h1>
              <p className="text-gray-600">Discover your strengths and get personalized career recommendations</p>
            </div>

            {/* Category Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Choose Test Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    selectedCategory === 'all' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                      selectedCategory === category 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Info */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4">Test Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <Timer className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Time per question varies</span>
                </div>
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{questions.length} questions available</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Instant results & recommendations</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startTest}
                disabled={questions.length === 0}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {questions.length === 0 ? 'No Questions Available' : 'Start Assessment'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) return null

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <div className="text-sm text-blue-600 font-medium">{currentQuestion.category}</div>
            </div>
            <div className="flex items-center text-red-600">
              <Timer className="w-5 h-5 mr-2" />
              <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    answers[currentQuestion._id] === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={answers[currentQuestion._id] === undefined}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete Test' : 'Next Question'}
            </button>
          </div>
        </motion.div>
      </div>
      </div>
      <Footer />
    </>
  )
}
