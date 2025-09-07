'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CareerPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeToComplete: string
  averageSalary: {
    entry: number
    mid: number
    senior: number
  }
  requiredEducation: string[]
  keySkills: string[]
  workEnvironment: string
  jobGrowth: number
  steps: {
    title: string
    description: string
    duration: string
    requirements: string[]
  }[]
  relatedJobs: string[]
  topEmployers: string[]
}

export default function CareersPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null)
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([])

  useEffect(() => {
    loadCareerPaths()
  }, [])

  const loadCareerPaths = () => {
    // Sample career path data
    const samplePaths: CareerPath[] = [
      {
        id: 'software-engineer',
        title: 'Software Engineer',
        description: 'Design, develop, and maintain software applications and systems.',
        category: 'technology',
        difficulty: 'medium',
        timeToComplete: '4-6 years',
        averageSalary: {
          entry: 600000,
          mid: 1200000,
          senior: 2500000
        },
        requiredEducation: ['Bachelor\'s in Computer Science', 'Bachelor\'s in IT', 'Coding Bootcamp'],
        keySkills: ['Programming', 'Problem Solving', 'System Design', 'Debugging'],
        workEnvironment: 'Office/Remote',
        jobGrowth: 22,
        steps: [
          {
            title: 'Complete Education',
            description: 'Get a bachelor\'s degree in Computer Science or related field',
            duration: '4 years',
            requirements: ['Class 12 with Math', 'JEE Main/Advanced', 'Good college admission']
          },
          {
            title: 'Learn Programming',
            description: 'Master programming languages like Java, Python, JavaScript',
            duration: '1-2 years',
            requirements: ['Online courses', 'Practice projects', 'Coding challenges']
          },
          {
            title: 'Build Portfolio',
            description: 'Create projects to showcase your skills',
            duration: '6 months',
            requirements: ['GitHub profile', '3-5 projects', 'Documentation']
          },
          {
            title: 'Gain Experience',
            description: 'Start with internships or entry-level positions',
            duration: '1-2 years',
            requirements: ['Technical interviews', 'Resume building', 'Networking']
          }
        ],
        relatedJobs: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer'],
        topEmployers: ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro']
      },
      {
        id: 'data-scientist',
        title: 'Data Scientist',
        description: 'Extract insights from data to solve business problems using statistical analysis and machine learning.',
        category: 'technology',
        difficulty: 'hard',
        timeToComplete: '5-7 years',
        averageSalary: {
          entry: 800000,
          mid: 1500000,
          senior: 3000000
        },
        requiredEducation: ['Bachelor\'s in Math/Stats/CS', 'Master\'s preferred', 'Data Science Certification'],
        keySkills: ['Statistics', 'Machine Learning', 'Python/R', 'Data Visualization'],
        workEnvironment: 'Office/Remote',
        jobGrowth: 35,
        steps: [
          {
            title: 'Strong Foundation',
            description: 'Master mathematics, statistics, and programming',
            duration: '4 years',
            requirements: ['Bachelor\'s degree', 'Math proficiency', 'Programming skills']
          },
          {
            title: 'Learn Data Tools',
            description: 'Master Python, R, SQL, and data visualization tools',
            duration: '1 year',
            requirements: ['Online courses', 'Kaggle competitions', 'Portfolio projects']
          },
          {
            title: 'Specialize',
            description: 'Choose specialization like ML, NLP, or Computer Vision',
            duration: '1-2 years',
            requirements: ['Advanced courses', 'Research projects', 'Industry experience']
          }
        ],
        relatedJobs: ['Machine Learning Engineer', 'Data Analyst', 'Research Scientist', 'AI Engineer'],
        topEmployers: ['Google', 'Facebook', 'Netflix', 'Uber', 'McKinsey', 'BCG']
      },
      {
        id: 'doctor',
        title: 'Doctor (MBBS)',
        description: 'Diagnose and treat patients, provide medical care and health advice.',
        category: 'medical',
        difficulty: 'hard',
        timeToComplete: '10+ years',
        averageSalary: {
          entry: 500000,
          mid: 1000000,
          senior: 2000000
        },
        requiredEducation: ['MBBS (5.5 years)', 'MD/MS (3 years)', 'Super-specialty (3 years)'],
        keySkills: ['Medical Knowledge', 'Diagnosis', 'Patient Care', 'Communication'],
        workEnvironment: 'Hospital/Clinic',
        jobGrowth: 15,
        steps: [
          {
            title: 'NEET Qualification',
            description: 'Clear NEET exam for medical college admission',
            duration: '1-2 years',
            requirements: ['Class 12 with PCB', 'NEET preparation', 'High score']
          },
          {
            title: 'MBBS Degree',
            description: 'Complete 5.5 years of medical education',
            duration: '5.5 years',
            requirements: ['Medical college admission', 'Clinical training', 'Internship']
          },
          {
            title: 'Specialization',
            description: 'Pursue MD/MS in chosen specialty',
            duration: '3 years',
            requirements: ['NEET PG exam', 'Residency training', 'Research']
          }
        ],
        relatedJobs: ['Surgeon', 'Physician', 'Specialist', 'Medical Researcher'],
        topEmployers: ['AIIMS', 'Apollo', 'Fortis', 'Max Healthcare', 'Government Hospitals']
      }
    ]
    
    setCareerPaths(samplePaths)
  }

  const categories = [
    { id: 'all', name: 'All Careers', icon: Target },
    { id: 'technology', name: 'Technology', icon: BookOpen },
    { id: 'medical', name: 'Medical', icon: Award },
    { id: 'engineering', name: 'Engineering', icon: Briefcase },
    { id: 'business', name: 'Business', icon: TrendingUp },
    { id: 'arts', name: 'Arts & Design', icon: Users }
  ]

  const filteredPaths = careerPaths.filter(path => 
    selectedCategory === 'all' || path.category === selectedCategory
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatSalary = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    return `₹${amount.toLocaleString()}`
  }

  if (selectedCareer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => setSelectedCareer(null)}
            className="mb-6"
          >
            ← Back to Career Paths
          </Button>

          {/* Career Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{selectedCareer.title}</CardTitle>
                      <CardDescription className="text-base">{selectedCareer.description}</CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedCareer.difficulty)}`}>
                      {selectedCareer.difficulty.toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="font-medium">{selectedCareer.timeToComplete}</div>
                      <div className="text-sm text-gray-600">Time to Complete</div>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="font-medium">{selectedCareer.jobGrowth}%</div>
                      <div className="text-sm text-gray-600">Job Growth</div>
                    </div>
                    <div className="text-center">
                      <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="font-medium">{formatSalary(selectedCareer.averageSalary.entry)}</div>
                      <div className="text-sm text-gray-600">Entry Salary</div>
                    </div>
                    <div className="text-center">
                      <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <div className="font-medium">{selectedCareer.workEnvironment}</div>
                      <div className="text-sm text-gray-600">Work Environment</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Path Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Career Path Steps</CardTitle>
                  <CardDescription>Follow this roadmap to achieve your career goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {selectedCareer.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                          <p className="text-gray-600 mb-3">{step.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-blue-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {step.duration}
                            </span>
                          </div>
                          <div className="mt-3">
                            <div className="text-sm font-medium text-gray-700 mb-2">Requirements:</div>
                            <ul className="space-y-1">
                              {step.requirements.map((req, reqIndex) => (
                                <li key={reqIndex} className="flex items-center text-sm text-gray-600">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salary Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Salary Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Entry Level</span>
                    <span className="font-medium">{formatSalary(selectedCareer.averageSalary.entry)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mid Level</span>
                    <span className="font-medium">{formatSalary(selectedCareer.averageSalary.mid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Senior Level</span>
                    <span className="font-medium">{formatSalary(selectedCareer.averageSalary.senior)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Required Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedCareer.keySkills.map((skill, index) => (
                      <div key={index} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Employers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Employers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedCareer.topEmployers.map((employer, index) => (
                      <div key={index} className="text-sm text-gray-700">{employer}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Careers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedCareer.relatedJobs.map((job, index) => (
                      <div key={index} className="text-sm text-gray-700">{job}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button className="w-full" onClick={() => router.push('/courses')}>
                    Find Related Courses
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => router.push('/colleges')}>
                    Find Colleges
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => router.push('/aptitude')}>
                    Take Aptitude Test
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Career Paths
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover detailed roadmaps for various careers, including education requirements, 
            skills needed, salary expectations, and step-by-step guidance.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <IconComponent className="h-4 w-4" />
                <span>{category.name}</span>
              </Button>
            )
          })}
        </div>

        {/* Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((career) => (
            <Card 
              key={career.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedCareer(career)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{career.title}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(career.difficulty)}`}>
                    {career.difficulty}
                  </span>
                </div>
                <CardDescription>{career.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {career.timeToComplete}
                    </span>
                    <span className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {career.jobGrowth}% growth
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Entry Salary</div>
                      <div className="font-medium text-lg">{formatSalary(career.averageSalary.entry)}</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>

                  <Button variant="outline" className="w-full">
                    View Career Path
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No careers found</h3>
            <p className="text-gray-600">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
