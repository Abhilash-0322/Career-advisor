'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const INTERESTS_OPTIONS = [
  'Programming', 'Data Science', 'Web Development', 'Mobile Development',
  'Machine Learning', 'Artificial Intelligence', 'Cloud Computing', 'DevOps',
  'Cybersecurity', 'Game Development', 'UI/UX Design', 'Blockchain',
  'Internet of Things', 'Robotics', 'Digital Marketing', 'Business Analytics'
]

const CAREER_GOALS = [
  'Software Developer', 'Data Scientist', 'Web Developer', 'Mobile App Developer',
  'Machine Learning Engineer', 'AI Researcher', 'Cloud Architect', 'DevOps Engineer',
  'Cybersecurity Analyst', 'Game Developer', 'UI/UX Designer', 'Product Manager',
  'Technical Lead', 'Entrepreneur', 'Freelancer', 'Consultant'
]

const CURRENT_SKILLS = [
  'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Git',
  'HTML/CSS', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
  'Linux', 'Data Analysis', 'Machine Learning', 'Project Management'
]

const LEARNING_STYLES = [
  { value: 'visual', label: 'Visual (videos, diagrams, infographics)' },
  { value: 'hands-on', label: 'Hands-on (coding projects, labs)' },
  { value: 'reading', label: 'Reading (documentation, books)' },
  { value: 'interactive', label: 'Interactive (quizzes, discussions)' }
]

const TIME_COMMITMENTS = [
  { value: '5-10', label: '5-10 hours per week' },
  { value: '10-15', label: '10-15 hours per week' },
  { value: '15-20', label: '15-20 hours per week' },
  { value: '20+', label: '20+ hours per week' }
]

const BUDGET_RANGES = [
  { value: 'free', label: 'Free courses only' },
  { value: '0-50', label: '$0 - $50' },
  { value: '50-200', label: '$50 - $200' },
  { value: '200-500', label: '$200 - $500' },
  { value: '500+', label: '$500+' }
]

const EDUCATION_LEVELS = [
  { value: 'high-school', label: 'High School' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'professional', label: 'Working Professional' }
]

export default function ProfileSetupPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState({
    interests: [] as string[],
    careerGoals: [] as string[],
    currentSkills: [] as string[],
    skillGaps: [] as string[],
    learningStyle: '',
    timeCommitment: '',
    budgetRange: '',
    educationLevel: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [recommendationsData, setRecommendationsData] = useState<any>(null)

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const handleSave = async () => {
    setIsLoading(true)
    setSaveMessage('')
    setRecommendationsData(null)
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id || 'anonymous',
          email: session?.user?.email,
          ...profile
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSaveMessage(`Profile updated successfully! ${data.recommendationsCount || 0} AI course recommendations generated and saved.`)
        setRecommendationsData(data)
        setTimeout(() => setSaveMessage(''), 5000)
      } else {
        setSaveMessage('Failed to save profile')
      }
    } catch (error) {
      setSaveMessage('Error saving profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Set Up Your Learning Profile
          </h1>
          <p className="text-lg text-gray-600">
            Help us personalize your course recommendations
          </p>
        </div>

        <div className="space-y-8">
          {/* Education Level */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Education Level</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EDUCATION_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setProfile(prev => ({ ...prev, educationLevel: level.value }))}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    profile.educationLevel === level.value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white hover:bg-blue-50 border-gray-200'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Interests */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">What interests you? (Select multiple)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {INTERESTS_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => setProfile(prev => ({ 
                    ...prev, 
                    interests: toggleArrayItem(prev.interests, interest) 
                  }))}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    profile.interests.includes(interest)
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white hover:bg-green-50 border-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </Card>

          {/* Career Goals */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Career Goals (Select multiple)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CAREER_GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setProfile(prev => ({ 
                    ...prev, 
                    careerGoals: toggleArrayItem(prev.careerGoals, goal) 
                  }))}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    profile.careerGoals.includes(goal)
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white hover:bg-purple-50 border-gray-200'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </Card>

          {/* Current Skills */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Current Skills (Select what you know)</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {CURRENT_SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setProfile(prev => ({ 
                    ...prev, 
                    currentSkills: toggleArrayItem(prev.currentSkills, skill) 
                  }))}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    profile.currentSkills.includes(skill)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white hover:bg-orange-50 border-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </Card>

          {/* Learning Preferences */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Learning Style */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Learning Style</h3>
              <div className="space-y-2">
                {LEARNING_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setProfile(prev => ({ ...prev, learningStyle: style.value }))}
                    className={`w-full p-3 rounded-lg border text-sm text-left transition-all ${
                      profile.learningStyle === style.value
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white hover:bg-blue-50 border-gray-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Time Commitment */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Time Commitment</h3>
              <div className="space-y-2">
                {TIME_COMMITMENTS.map((time) => (
                  <button
                    key={time.value}
                    onClick={() => setProfile(prev => ({ ...prev, timeCommitment: time.value }))}
                    className={`w-full p-3 rounded-lg border text-sm text-left transition-all ${
                      profile.timeCommitment === time.value
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white hover:bg-green-50 border-gray-200'
                    }`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Budget Range */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Budget Range</h3>
              <div className="space-y-2">
                {BUDGET_RANGES.map((budget) => (
                  <button
                    key={budget.value}
                    onClick={() => setProfile(prev => ({ ...prev, budgetRange: budget.value }))}
                    className={`w-full p-3 rounded-lg border text-sm text-left transition-all ${
                      profile.budgetRange === budget.value
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'bg-white hover:bg-purple-50 border-gray-200'
                    }`}
                  >
                    {budget.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? 'Saving...' : 'Save Profile & Get Recommendations'}
            </Button>
            {saveMessage && (
              <p className={`mt-2 ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage}
              </p>
            )}
          </div>

          {/* AI Recommendations Display */}
          {recommendationsData?.courseRecommendations && recommendationsData.courseRecommendations.length > 0 && (
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <h3 className="text-xl font-semibold mb-4 text-green-800">
                🎯 Your Personalized Course Recommendations (Saved to Database)
              </h3>
              <p className="text-green-700 mb-4">
                Based on your profile, we've generated {recommendationsData.recommendationsCount} personalized course recommendations and saved them to your account.
              </p>
              <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {recommendationsData.courseRecommendations.slice(0, 6).map((course: any, index: number) => (
                  <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Provider:</span> {course.provider}</p>
                      <p><span className="font-medium">Level:</span> {course.level}</p>
                      <p><span className="font-medium">Match:</span> {course.match_percentage}%</p>
                      {course.cost && <p><span className="font-medium">Cost:</span> {course.cost}</p>}
                    </div>
                    {course.reasoning && (
                      <p className="text-xs text-blue-600 mt-2 italic">
                        {course.reasoning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <a href="/courses" className="text-blue-600 hover:text-blue-800 font-medium">
                  View All Recommendations on Courses Page →
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
