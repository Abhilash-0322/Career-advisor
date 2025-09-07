'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, BookOpen, GraduationCap, AlertTriangle } from 'lucide-react'

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  type: 'exam' | 'admission' | 'scholarship' | 'deadline'
  status: 'upcoming' | 'active' | 'completed'
  priority: 'high' | 'medium' | 'low'
}

const sampleEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'JEE Main 2024 Application',
    description: 'Joint Entrance Examination for engineering admissions',
    date: '2024-03-15',
    type: 'exam',
    status: 'upcoming',
    priority: 'high'
  },
  {
    id: '2',
    title: 'NEET Registration',
    description: 'National Eligibility cum Entrance Test for medical courses',
    date: '2024-03-20',
    type: 'exam', 
    status: 'upcoming',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Merit Scholarship Application',
    description: 'Apply for merit-based scholarships',
    date: '2024-04-01',
    type: 'scholarship',
    status: 'upcoming',
    priority: 'medium'
  }
]

export default function TimelinePage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [events] = useState<TimelineEvent[]>(sampleEvents)

  const filteredEvents = events.filter(event => 
    selectedFilter === 'all' || event.type === selectedFilter
  )

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam': return <BookOpen className="h-5 w-5" />
      case 'admission': return <GraduationCap className="h-5 w-5" />
      case 'scholarship': return <AlertTriangle className="h-5 w-5" />
      default: return <Calendar className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Academic Timeline</h1>
            <p className="text-gray-600 mb-6">Track important dates and deadlines for your academic journey</p>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'exam', 'admission', 'scholarship', 'deadline'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className={`transition-all hover:shadow-md ${getPriorityColor(event.priority)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.priority === 'high' ? 'bg-red-100 text-red-800' :
                            event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {event.priority} priority
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className={`px-3 py-1 text-xs rounded-full font-medium ${
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'active' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">No events match your current filter criteria.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
