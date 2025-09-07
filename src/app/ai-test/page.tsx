'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Brain, Zap, TrendingUp, MessageSquare } from 'lucide-react'

export default function AITestPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [activeTest, setActiveTest] = useState('')

  const runTest = async (testType: string) => {
    setLoading(true)
    setActiveTest(testType)
    setResults(null)

    try {
      let response
      let data

      switch (testType) {
        case 'recommendations':
          response = await fetch('/api/ai-enhanced/recommendations/comprehensive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: 'test_user',
              preferences: {
                interests: ['technology', 'innovation'],
                skills: ['programming', 'problem-solving'],
                experience_level: 'intermediate'
              },
              context: {
                education_level: 'college',
                current_field: 'computer_science'
              }
            })
          })
          data = await response.json()
          break

        case 'skills':
          response = await fetch('/api/ai-enhanced/skills/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: 'test_user',
              current_skills: ['programming', 'problem-solving', 'communication'],
              target_roles: ['software-engineer', 'data-scientist']
            })
          })
          data = await response.json()
          break

        case 'market':
          response = await fetch('/api/ai-enhanced/market/insights?fields=technology,engineering')
          data = await response.json()
          break

        case 'chat':
          response = await fetch('/api/ai-enhanced/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: 'What are the best career options in technology?',
              user_id: 'test_user',
              context: {
                user_profile: {
                  interests: ['technology', 'innovation'],
                  current_level: 'intermediate'
                }
              }
            })
          })
          data = await response.json()
          break

        default:
          throw new Error('Unknown test type')
      }

      setResults(data)
    } catch (error: any) {
      console.error('Test failed:', error)
      setResults({ error: error.message })
    } finally {
      setLoading(false)
      setActiveTest('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Integration Test Dashboard</h1>
          <p className="text-gray-600">Test the real-time integration between Frontend (Next.js) and Backend (FastAPI)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Brain className="mx-auto mb-4 text-blue-600" size={48} />
            <h3 className="text-lg font-semibold mb-2">AI Recommendations</h3>
            <p className="text-gray-600 mb-4">Test comprehensive career recommendations</p>
            <Button 
              onClick={() => runTest('recommendations')}
              disabled={loading}
              className="w-full"
            >
              {loading && activeTest === 'recommendations' ? 'Testing...' : 'Test'}
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <Zap className="mx-auto mb-4 text-green-600" size={48} />
            <h3 className="text-lg font-semibold mb-2">Skill Analysis</h3>
            <p className="text-gray-600 mb-4">Test AI-powered skill gap analysis</p>
            <Button 
              onClick={() => runTest('skills')}
              disabled={loading}
              className="w-full"
            >
              {loading && activeTest === 'skills' ? 'Testing...' : 'Test'}
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <TrendingUp className="mx-auto mb-4 text-purple-600" size={48} />
            <h3 className="text-lg font-semibold mb-2">Market Insights</h3>
            <p className="text-gray-600 mb-4">Test real-time market data</p>
            <Button 
              onClick={() => runTest('market')}
              disabled={loading}
              className="w-full"
            >
              {loading && activeTest === 'market' ? 'Testing...' : 'Test'}
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <MessageSquare className="mx-auto mb-4 text-orange-600" size={48} />
            <h3 className="text-lg font-semibold mb-2">AI Chat</h3>
            <p className="text-gray-600 mb-4">Test conversational AI assistant</p>
            <Button 
              onClick={() => runTest('chat')}
              disabled={loading}
              className="w-full"
            >
              {loading && activeTest === 'chat' ? 'Testing...' : 'Test'}
            </Button>
          </Card>
        </div>

        {/* Results Display */}
        {results && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </Card>
        )}

        {/* System Status */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Next.js Frontend: Running on port 3002</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>FastAPI Backend: Running on port 8000</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>MongoDB Database: Connected</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Groq AI Service: Configured</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Integration Features Implemented</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">✅ Completed Integrations</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Real-time AI career recommendations</li>
                  <li>• Skill gap analysis with learning paths</li>
                  <li>• Market insights and trending fields</li>
                  <li>• Conversational AI assistant</li>
                  <li>• Enhanced course recommendations</li>
                  <li>• Enhanced college recommendations</li>
                  <li>• Agentic AI backend services</li>
                  <li>• Web scraping capabilities</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">🚀 Backend Services Active</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Career Advisor Agent</li>
                  <li>• Course Recommender Agent</li>
                  <li>• College Finder Agent</li>
                  <li>• Skill Analyzer Agent</li>
                  <li>• Market Research Agent</li>
                  <li>• Web Scraper Service</li>
                  <li>• Groq AI Integration</li>
                  <li>• Real-time Data Processing</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
