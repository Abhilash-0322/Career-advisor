import Link from 'next/link'
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Aptitude Test', href: '/aptitude' },
        { name: 'Course Explorer', href: '/courses' },
        { name: 'College Finder', href: '/colleges' },
        { name: 'Career Paths', href: '/careers' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Study Materials', href: '/resources' },
        { name: 'Scholarships', href: '/scholarships' },
        { name: 'Government Exams', href: '/exams' },
        { name: 'Career Guide', href: '/guide' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Feedback', href: '/feedback' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Disclaimer', href: '/disclaimer' },
      ],
    },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl">Career Advisor</span>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering students to make informed career decisions and find the right path to their future.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@careeradvisor.gov.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Ministry of Education, Govt of India</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Career Advisor Platform. A Digital India Initiative.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Part of Smart India Hackathon 2024</span>
              <div className="flex items-center space-x-4">
                <img
                  src="/api/placeholder/40/40"
                  alt="Digital India"
                  className="h-8 w-8"
                />
                <img
                  src="/api/placeholder/40/40"
                  alt="Government of India"
                  className="h-8 w-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
