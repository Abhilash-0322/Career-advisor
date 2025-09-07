'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function TimelinePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Timeline</h1>
          <p className="text-gray-600">
            Stay on top of important dates, deadlines, and milestones in your academic journey
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}
