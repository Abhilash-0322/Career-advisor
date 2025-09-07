'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Timer, CheckCircle, XCircle, BarChart3, Brain, Target, Users, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AptitudePage() {
  const assessmentTypes = [
    {
      id: 'personality',
      title: 'Personality Assessment',
      description: 'Understand your personality traits and how they align with different career paths.',
      duration: '15-20 minutes',
      questions: 50,
      icon: Brain,
      color: 'bg-blue-500',
      features: [
        'Big Five personality traits analysis',
        'Work style preferences',
        'Communication patterns',
        'Decision-making style'
      ]
    },
    {
      id: 'aptitude',
      title: 'Aptitude Test',
      description: 'Measure your cognitive abilities across different domains.',
      duration: '25-30 minutes',
      questions: 75,
      icon: Target,
      color: 'bg-green-500',
      features: [
        'Logical reasoning',
        'Numerical ability',
        'Verbal comprehension',
        'Spatial intelligence'
      ]
    },
    {
      id: 'interest',
      title: 'Interest Inventory',
      description: 'Discover what subjects and activities truly interest you.',
      duration: '10-15 minutes',
      questions: 60,
      icon: Users,
      color: 'bg-purple-500',
      features: [
        'Academic interest areas',
        'Career field preferences',
        'Activity preferences',
        'Work environment choices'
      ]
    },
    {
      id: 'skill',
      title: 'Skill Assessment',
      description: 'Evaluate your current skills and identify areas for development.',
      duration: '20-25 minutes',
      questions: 45,
      icon: Clock,
      color: 'bg-orange-500',
      features: [
        'Technical skills evaluation',
        'Soft skills assessment',
        'Learning style analysis',
        'Skill gap identification'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Assessment Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take comprehensive assessments to discover your strengths, interests, and ideal career paths. 
            Get personalized recommendations based on scientific analysis.
          </p>
        </motion.div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {assessmentTypes.map((assessment, index) => {
            const IconComponent = assessment.icon
            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${assessment.color} rounded-lg flex items-center justify-center mr-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{assessment.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {assessment.duration} • {assessment.questions} questions
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{assessment.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-medium text-gray-900">What you'll discover:</h4>
                    <ul className="space-y-1">
                      {assessment.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href={`/aptitude-test`}>
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <span>Start Assessment</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Take Our Assessments?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-2">50,000+</h3>
              <p className="text-gray-600">Students assessed successfully</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-green-600 mb-2">95%</h3>
              <p className="text-gray-600">Accuracy in career matching</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">1000+</h3>
              <p className="text-gray-600">Career paths analyzed</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Discover Your Future?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of students who have found their perfect career path through our assessment.
          </p>
          <Link href="/aptitude-test">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Your Journey Today
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
