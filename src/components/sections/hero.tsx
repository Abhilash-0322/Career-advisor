import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Users, 
  Award, 
  TrendingUp,
  BookOpen,
  MapPin,
  Clock
} from 'lucide-react'

export function Hero() {
  const stats = [
    { label: 'Students Guided', value: '50,000+', icon: Users },
    { label: 'Government Colleges', value: '2,500+', icon: MapPin },
    { label: 'Career Paths', value: '100+', icon: TrendingUp },
    { label: 'Success Rate', value: '92%', icon: Award },
  ]

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Award className="h-4 w-4 mr-2" />
                Smart India Hackathon 2024 Project
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Digital
                <span className="text-blue-600"> Career Compass</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Navigate your educational journey with confidence. Get personalized guidance 
                on courses, colleges, and career paths tailored to your interests and aptitude.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/aptitude">
                <Button size="lg" className="w-full sm:w-auto">
                  Take Aptitude Test
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Courses
                </Button>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8">
              <Link href="/colleges" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <MapPin className="h-5 w-5" />
                <span className="text-sm">Find Colleges</span>
              </Link>
              <Link href="/scholarships" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Award className="h-5 w-5" />
                <span className="text-sm">Scholarships</span>
              </Link>
              <Link href="/timeline" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Timeline</span>
              </Link>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen className="h-24 w-24 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Smart Guidance</h3>
                  <p className="text-blue-100">AI-powered career recommendations</p>
                </div>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 border">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Live Support</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">24/7 Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-gray-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
