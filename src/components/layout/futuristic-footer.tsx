'use client'

import { motion } from 'framer-motion'
import { 
  Brain,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  ArrowRight,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { GlowingOrb, FloatingElement } from '@/components/ui/animated-components'

export function FuturisticFooter() {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Aptitude Tests', href: '/assessments' },
        { name: 'Course Explorer', href: '/courses' },
        { name: 'College Finder', href: '/colleges' },
        { name: 'Timeline Tracker', href: '/timeline' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Career Guides', href: '/guides' },
        { name: 'Industry Reports', href: '/reports' },
        { name: 'Success Stories', href: '/testimonials' },
        { name: 'Help Center', href: '/help' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Contact', href: '/contact' }
      ]
    }
  ]

  const socialLinks = [
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-500' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-400' }
  ]

  return (
    <footer className="relative bg-black border-t border-blue-500/20 overflow-hidden">
      {/* Background Effects */}
      <GlowingOrb size={300} color="#4facfe" className="top-20 left-10" />
      <GlowingOrb size={250} color="#f093fb" className="bottom-20 right-20" />
      <GlowingOrb size={200} color="#43e97b" className="top-40 right-1/4" />

      {/* Animated Grid Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79, 172, 254, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79, 172, 254, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement duration={6} delay={0}>
          <Sparkles className="absolute top-32 left-32 text-blue-400 w-6 h-6 opacity-30" />
        </FloatingElement>
        <FloatingElement duration={4} delay={2}>
          <Zap className="absolute bottom-40 right-40 text-purple-400 w-7 h-7 opacity-25" />
        </FloatingElement>
        <FloatingElement duration={5} delay={1}>
          <Heart className="absolute top-20 right-32 text-pink-400 w-5 h-5 opacity-35" />
        </FloatingElement>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Brain className="w-7 h-7 text-white" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-50 blur-md"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold tech-font holographic">CareerNav</h3>
                  <p className="text-sm text-gray-400">AI-Powered Guidance</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                Transforming careers through cutting-edge AI technology and personalized guidance. 
                Your future starts here.
              </p>

              {/* Newsletter Signup */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-white font-semibold">Stay Updated</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <motion.button
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-r-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Links Sections */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              >
                <h4 className="text-white font-semibold text-lg mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-800 py-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-center lg:text-left">
              <p>&copy; 2024 CareerNav. All rights reserved.</p>
              <p className="text-sm mt-1">
                Made with <Heart className="w-4 h-4 inline text-red-400" /> for Smart India Hackathon 2024
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 border border-gray-700 hover:border-gray-600`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Glow Effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-20 bg-gradient-to-t from-blue-500/10 to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8 }}
      />
    </footer>
  )
}
