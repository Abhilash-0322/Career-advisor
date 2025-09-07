'use client'

import { motion } from 'framer-motion'
import { FuturisticHero } from '@/components/sections/futuristic-hero'
import { Features } from '@/components/sections/features'
import { HowItWorks } from '@/components/sections/futuristic-how-it-works'
import { Testimonials } from '@/components/sections/futuristic-testimonials'
import { FuturisticCTA } from '@/components/sections/futuristic-cta'
import { FuturisticHeader } from '@/components/layout/futuristic-header'
import { FuturisticFooter } from '@/components/layout/futuristic-footer'

export default function HomePage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
    >
      <FuturisticHeader />
      <main>
        <FuturisticHero />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Features />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HowItWorks />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Testimonials />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <FuturisticCTA />
        </motion.div>
      </main>
      <FuturisticFooter />
    </motion.div>
  )
}
