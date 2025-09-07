'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus,
  Filter,
  Bell,
  BookOpen,
  GraduationCap,
  DollarSign,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  endDate?: string
  type: 'exam' | 'admission' | 'scholarship' | 'deadline' | 'preparation'
  status: 'upcoming' | 'active' | 'completed' | 'missed'
  priority: 'high' | 'medium' | 'low'
  relatedTo?: string
  actionRequired?: boolean
}

export default function TimelinePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Load sample timeline data
    loadTimelineData()
  }, [session, status])

  const loadTimelineData = () => {
    // Sample timeline data - in production, this would come from API
    const sampleEvents: TimelineEvent[] = [
      {
        id: '1',
        title: 'JEE Main Registration Opens',
        description: 'Online registration for JEE Main 2025 begins. Complete application form and upload documents.',
        date: '2025-01-15',
        endDate: '2025-02-15',
        type: 'exam',
        status: 'upcoming',
        priority: 'high',
        actionRequired: true
      },
      {
        id: '2',
        title: 'NEET Application Deadline',
        description: 'Last date to submit NEET 2025 application form with required fees.',
        date: '2025-02-01',
        type: 'exam',
        status: 'upcoming',
        priority: 'high',
        actionRequired: true
      },
      {
        id: '3',
        title: 'JEE Main Exam (Session 1)',
        description: 'First session of JEE Main 2025 examination.',
        date: '2025-04-01',
        endDate: '2025-04-15',
        type: 'exam',
        status: 'upcoming',
        priority: 'high'
      },
      {
        id: '4',
        title: 'CBSE Board Exams',
        description: 'CBSE Class 12 board examinations begin.',
        date: '2025-02-15',
        endDate: '2025-04-10',
        type: 'exam',
        status: 'upcoming',
        priority: 'medium'
      },
      {
        id: '5',
        title: 'National Scholarship Portal',
        description: 'Apply for various government scholarships for higher education.',
        date: '2025-01-30',
        type: 'scholarship',
        status: 'upcoming',
        priority: 'medium',
        actionRequired: true
      },
      {
        id: '6',
        title: 'College Admission Forms',
        description: 'Start filling out college admission forms for various universities.',
        date: '2025-05-01',
        endDate: '2025-06-30',
        type: 'admission',
        status: 'upcoming',
        priority: 'high'
      },
      {
        id: '7',
        title: 'JEE Advanced Registration',
        description: 'Registration for JEE Advanced 2025 (for JEE Main qualifiers).',
        date: '2025-05-15',
        endDate: '2025-05-25',
        type: 'exam',
        status: 'upcoming',
        priority: 'high'
      },
      {
        id: '8',
        title: 'Document Verification',
        description: 'Document verification for college admissions.',
        date: '2025-07-01',
        endDate: '2025-07-15',
        type: 'admission',
        status: 'upcoming',
        priority: 'medium'
      }
    ]
    
    setEvents(sampleEvents)
    setIsLoading(false)
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam': return BookOpen
      case 'admission': return GraduationCap
      case 'scholarship': return DollarSign
      case 'deadline': return Clock
      case 'preparation': return FileText
      default: return Calendar
    }
  }

  const getEventColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-red-200 bg-red-50'
    if (priority === 'medium') return 'border-orange-200 bg-orange-50'
    return 'border-blue-200 bg-blue-50'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100'
      case 'active': return 'text-green-600 bg-green-100'
      case 'completed': return 'text-gray-600 bg-gray-100'
      case 'missed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredEvents = events.filter(event => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'action-required') return event.actionRequired
    return event.type === selectedFilter
  })

  const sortedEvents = filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading timeline...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Timeline</h1>
          <p className="text-gray-600">
            Stay on top of important dates, deadlines, and milestones in your academic journey
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
            >
              All Events
            </Button>
            <Button
              variant={selectedFilter === 'action-required' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('action-required')}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Action Required
            </Button>
            <Button
              variant={selectedFilter === 'exam' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('exam')}
            >
              Exams
            </Button>
            <Button
              variant={selectedFilter === 'admission' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('admission')}
            >
              Admissions
            </Button>
            <Button
              variant={selectedFilter === 'scholarship' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('scholarship')}
            >
              Scholarships
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Timeline */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {sortedEvents.map((event, index) => {
                const IconComponent = getEventIcon(event.type)
                const isUpcoming = new Date(event.date) > new Date()
                
                return (
                  <Card 
                    key={event.id}
                    className={`${getEventColor(event.type, event.priority)} border-l-4`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${event.priority === 'high' ? 'bg-red-100' : event.priority === 'medium' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                            <IconComponent className={`h-5 w-5 ${event.priority === 'high' ? 'text-red-600' : event.priority === 'medium' ? 'text-orange-600' : 'text-blue-600'}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                                {event.priority.toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                {event.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {event.actionRequired && (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">
                        {event.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.endDate 
                              ? `${new Date(event.date).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`
                              : new Date(event.date).toLocaleDateString()
                            }
                          </div>
                          {isUpcoming && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                            </div>
                          )}
                        </div>
                        
                        {event.actionRequired && (
                          <Button size="sm">
                            Take Action
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Events</span>
                    <span className="font-bold">{events.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Action Required</span>
                    <span className="font-bold text-red-600">
                      {events.filter(e => e.actionRequired).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-bold text-blue-600">
                      {events.filter(e => {
                        const eventDate = new Date(e.date)
                        const now = new Date()
                        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
                      }).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Urgent Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events
                    .filter(e => e.actionRequired && new Date(e.date) > new Date())
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800 text-sm">{event.title}</h4>
                        <p className="text-xs text-red-600 mt-1">
                          Due: {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Calendar Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendar View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4" />
                  <p>Calendar widget would be integrated here</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Open Full Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reminder Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reminder Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Email Notifications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  SMS Reminders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar Sync
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
