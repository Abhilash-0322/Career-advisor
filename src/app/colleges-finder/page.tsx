'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Star, TrendingUp, DollarSign, Users, Award, Building2, GraduationCap } from 'lucide-react'

interface College {
  _id: string
  name: string
  code: string
  type: 'Government' | 'Private' | 'Semi-Government'
  location: {
    city: string
    state: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  establishedYear: number
  affiliation: string
  courses: string[]
  facilities: string[]
  ranking: {
    nirf?: number
    qs?: number
    category: string
  }
  admissionProcess: {
    entrance_exams: string[]
    cutoff: {
      general: number
      obc: number
      sc: number
      st: number
    }
  }
  placement: {
    averagePackage: number
    highestPackage: number
    placementPercentage: number
    topRecruiters: string[]
  }
  fees: {
    tuition: number
    hostel: number
    total: number
  }
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const collegeTypes = ['Government', 'Private', 'Semi-Government']
  const states = [
    'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh',
    'Gujarat', 'Rajasthan', 'West Bengal', 'Telangana', 'Haryana'
  ]

  useEffect(() => {
    fetchColleges()
  }, [selectedState, selectedType, searchTerm, currentPage])

  const fetchColleges = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      })
      
      if (selectedState !== 'all') {
        params.append('state', selectedState)
      }
      
      if (selectedType !== 'all') {
        params.append('type', selectedType)
      }
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/colleges?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setColleges(data.data)
      }
    } catch (error) {
      console.error('Error fetching colleges:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const formatSalary = (salary: number) => {
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)}L`
    }
    return `₹${(salary / 1000).toFixed(0)}K`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Government': return 'text-green-600 bg-green-100'
      case 'Private': return 'text-blue-600 bg-blue-100'
      case 'Semi-Government': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRankingColor = (rank?: number) => {
    if (!rank) return 'text-gray-600'
    if (rank <= 10) return 'text-green-600'
    if (rank <= 50) return 'text-blue-600'
    if (rank <= 100) return 'text-yellow-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading colleges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream College</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore top colleges across India with detailed information about rankings, placements, fees, and admission processes.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search colleges by name, location, or specialization..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* State Filter */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {collegeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {colleges.length} colleges
            {selectedState !== 'all' && ` in ${selectedState}`}
            {selectedType !== 'all' && ` (${selectedType})`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* College Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {colleges.map((college, index) => (
            <motion.div
              key={college._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* College Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(college.type)}`}>
                      {college.type}
                    </span>
                    {college.ranking.nirf && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 ${getRankingColor(college.ranking.nirf)}`}>
                        NIRF #{college.ranking.nirf}
                      </span>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {college.location.city}, {college.location.state}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{college.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Established: {college.establishedYear} | Affiliation: {college.affiliation}
                </p>
              </div>

              {/* College Details */}
              <div className="p-6">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {college.placement.placementPercentage}%
                        </div>
                        <div className="text-sm text-blue-700">Placement Rate</div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatSalary(college.placement.averagePackage)}
                        </div>
                        <div className="text-sm text-green-700">Avg Package</div>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Courses */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Available Courses
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {college.courses.slice(0, 4).map((course, courseIndex) => (
                      <span
                        key={courseIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {course}
                      </span>
                    ))}
                    {college.courses.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{college.courses.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Building2 className="w-4 h-4 mr-1" />
                    Key Facilities
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {college.facilities.slice(0, 4).map((facility, facilityIndex) => (
                      <span
                        key={facilityIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {facility}
                      </span>
                    ))}
                    {college.facilities.length > 4 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        +{college.facilities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Top Recruiters */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Top Recruiters
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {college.placement.topRecruiters.slice(0, 3).map((recruiter, recruiterIndex) => (
                      <span
                        key={recruiterIndex}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                      >
                        {recruiter}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fees and Admission */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Annual Fees</h4>
                    <p className="text-lg font-semibold text-gray-700">
                      {formatSalary(college.fees.total)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Entrance Exams</h4>
                    <div className="flex flex-wrap gap-1">
                      {college.admissionProcess.entrance_exams.slice(0, 2).map((exam, examIndex) => (
                        <span
                          key={examIndex}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                        >
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Compare
                  </button>
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {colleges.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any colleges matching your criteria. Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedState('all')
                  setSelectedType('all')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {colleges.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
