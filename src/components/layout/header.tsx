'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { 
  GraduationCap, 
  Menu, 
  X, 
  User,
  LogOut,
  Settings,
  BookOpen,
  MapPin,
  Calendar
} from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Aptitude Test', href: '/aptitude' },
    { name: 'Course Explorer', href: '/courses' },
    { name: 'College Finder', href: '/colleges' },
    { name: 'Career Paths', href: '/careers' },
    { name: 'Timeline', href: '/timeline' },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-gray-900">Career Advisor</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/aptitude" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Aptitude Tests
          </Link>
          <Link 
            href="/courses" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Courses
          </Link>
          <Link 
            href="/colleges" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Colleges
          </Link>
          <Link 
            href="/timeline" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Timeline
          </Link>
          <Link 
            href="/ai-test" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            AI Test
          </Link>
          {session?.user && (
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm text-gray-700">{session.user?.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t pt-4 mt-4">
              {session ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    Signed in as {session.user?.name}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/auth/signin" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="block">
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
