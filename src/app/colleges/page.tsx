'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Award,
  Users,
  Wifi,
  Car,
  Home,
  BookOpen,
  Utensils,
  Activity
} from 'lucide-react'

interface College {
  _id: string
  name: string
  code: string
  type: string
  affiliation: string
  location: {
    city: string
    district: string
    state: string
    pincode: string
  }
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  facilities: {
    hostel: boolean
    library: boolean
    labs: string[]
    sports: string[]
    canteen: boolean
    transport: boolean
    wifi: boolean
    medical: boolean
  }
  rankings?: {
    nirf?: number
    state?: number
  }
  accreditation?: {
    naac?: {
      grade: string
      score: number
    }
  }
  isActive: boolean
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const collegeTypes = ['government', 'aided', 'private']
  const indianStates = [
    'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh',
    'Gujarat', 'Rajasthan', 'West Bengal', 'Haryana', 'Punjab'
  ]

  useEffect(() => {
    fetchColleges()
  }, [search, selectedState, selectedType])

  const fetchColleges = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedState) params.append('state', selectedState)
      if (selectedType) params.append('type', selectedType)

      const response = await fetch(`/api/colleges?${params}`)
      const data = await response.json()
      setColleges(data.colleges || [])
    } catch (error) {
      console.error('Error fetching colleges:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderFacilityIcon = (facility: string, available: boolean) => {
    if (!available) return null

    const iconMap: { [key: string]: any } = {
      hostel: Home,
      library: BookOpen,
      canteen: Utensils,
      transport: Car,
      wifi: Wifi,
      medical: Activity
    }

    const IconComponent = iconMap[facility]
    return IconComponent ? <IconComponent className="h-4 w-4 text-green-600" /> : null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Government Colleges</h1>
          <p className="text-xl text-gray-600">
            Discover quality government colleges near you with comprehensive information
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search colleges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All States</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {collegeTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearch('')
                setSelectedState('')
                setSelectedType('')
              }}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Colleges Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-72">
                  <CardHeader>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No colleges found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters to find relevant colleges.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {colleges.map((college) => (
              <Card key={college._id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{college.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <span>{college.code}</span>
                        <span>•</span>
                        <span className="capitalize">{college.type}</span>
                      </CardDescription>
                    </div>
                    {college.rankings?.nirf && (
                      <div className="flex items-center space-x-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                        <Award className="h-4 w-4" />
                        <span className="text-sm font-medium">NIRF #{college.rankings?.nirf}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location */}
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <div>{college.location?.city}, {college.location?.district}</div>
                      <div>{college.location?.state} - {college.location?.pincode}</div>
                    </div>
                  </div>

                  {/* Affiliation */}
                  <div className="text-sm">
                    <span className="text-gray-600">Affiliated to: </span>
                    <span className="font-medium">{college.affiliation}</span>
                  </div>

                  {/* Accreditation */}
                  {college.accreditation?.naac && (
                    <div className="flex items-center space-x-2">
                      <div className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        NAAC {college.accreditation?.naac?.grade}
                      </div>
                      <span className="text-sm text-gray-600">
                        Score: {college.accreditation?.naac?.score}/4.0
                      </span>
                    </div>
                  )}

                  {/* Facilities */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Facilities:</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {renderFacilityIcon('hostel', college.facilities?.hostel) && (
                        <div className="flex items-center space-x-1" title="Hostel">
                          {renderFacilityIcon('hostel', college.facilities?.hostel)}
                          <span className="text-xs text-gray-600">Hostel</span>
                        </div>
                      )}
                      {renderFacilityIcon('library', college.facilities?.library) && (
                        <div className="flex items-center space-x-1" title="Library">
                          {renderFacilityIcon('library', college.facilities?.library)}
                          <span className="text-xs text-gray-600">Library</span>
                        </div>
                      )}
                      {renderFacilityIcon('canteen', college.facilities?.canteen) && (
                        <div className="flex items-center space-x-1" title="Canteen">
                          {renderFacilityIcon('canteen', college.facilities?.canteen)}
                          <span className="text-xs text-gray-600">Canteen</span>
                        </div>
                      )}
                      {renderFacilityIcon('wifi', college.facilities?.wifi) && (
                        <div className="flex items-center space-x-1" title="WiFi">
                          {renderFacilityIcon('wifi', college.facilities?.wifi)}
                          <span className="text-xs text-gray-600">WiFi</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="border-t pt-3 space-y-2">
                    {college.contact?.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{college.contact?.phone}</span>
                      </div>
                    )}
                    {college.contact?.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{college.contact?.email}</span>
                      </div>
                    )}
                    {college.contact?.website && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={college.contact?.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button className="w-full" size="sm">
                    View Details & Apply
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
