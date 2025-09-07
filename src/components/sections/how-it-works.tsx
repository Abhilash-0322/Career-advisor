import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  User, 
  Brain, 
  BookOpen, 
  MapPin, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: User,
      title: 'Create Your Profile',
      description: 'Sign up and tell us about your academic background, interests, and goals.',
      details: ['Basic information setup', 'Academic history', 'Interest preferences'],
      color: 'bg-blue-500',
    },
    {
      number: 2,
      icon: Brain,
      title: 'Take Aptitude Tests',
      description: 'Complete our comprehensive assessment to understand your strengths and interests.',
      details: ['Multiple intelligence test', 'Personality assessment', 'Skill evaluation'],
      color: 'bg-green-500',
    },
    {
      number: 3,
      icon: BookOpen,
      title: 'Get Recommendations',
      description: 'Receive personalized course and career recommendations based on your profile.',
      details: ['Course suggestions', 'Career path mapping', 'College matching'],
      color: 'bg-purple-500',
    },
    {
      number: 4,
      icon: MapPin,
      title: 'Find Your College',
      description: 'Discover nearby government colleges that offer your recommended courses.',
      details: ['Location-based search', 'Admission requirements', 'Application guidance'],
      color: 'bg-orange-500',
    },
    {
      number: 5,
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Monitor application deadlines, scholarship opportunities, and career milestones.',
      details: ['Timeline tracking', 'Deadline alerts', 'Progress monitoring'],
      color: 'bg-pink-500',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Our Platform
            <span className="text-blue-600"> Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow our simple 5-step process to discover your ideal career path and 
            find the perfect government college for your future.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full h-1">
            <div className="flex justify-between items-center h-full max-w-6xl mx-auto px-16">
              {steps.slice(0, -1).map((_, index) => (
                <div key={index} className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
              ))}
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    {/* Step Number & Icon */}
                    <div className="relative mx-auto mb-4">
                      <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-700">{step.number}</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg font-semibold">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{step.description}</p>
                    
                    {/* Step Details */}
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center text-xs text-gray-500">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-4 mb-4">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already discovered their perfect career path 
            with our comprehensive guidance platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
