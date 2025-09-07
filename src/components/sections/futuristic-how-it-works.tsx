'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Play, 
  User, 
  Brain, 
  Target, 
  BookOpen, 
  Trophy,
  ArrowRight,
  Sparkles,
  Zap,
  Stars
} from 'lucide-react'
import { AnimatedCard, GlowingOrb, FloatingElement, AnimatedCounter } from '@/components/ui/animated-components'

interface StepProps {
  number: number
  icon: React.ComponentType<any>
  title: string
  description: string
  color: string
  delay: number
}

const StepCard = ({ number, icon: Icon, title, description, color, delay }: StepProps) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <AnimatedCard delay={delay} className="relative overflow-hidden group h-full">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Step Number */}
        <motion.div
          className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {number}
        </motion.div>

        <div className="relative z-10 p-8 pt-12">
          {/* Icon */}
          <motion.div
            className="mb-6"
            whileHover={{ y: -10, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.h3 
            className="text-2xl font-bold mb-4 tech-font text-white"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 }}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className="text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.3 }}
          >
            {description}
          </motion.p>

          {/* Hover Arrow */}
          <motion.div
            className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ x: 5 }}
          >
            <ArrowRight className="w-6 h-6 text-blue-400" />
          </motion.div>
        </div>
      </AnimatedCard>

      {/* Connection Line (except for last item) */}
      {number < 4 && (
        <motion.div
          className="hidden lg:block absolute top-1/2 -right-8 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.5 }}
        />
      )}
    </motion.div>
  )
}

export function HowItWorks() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const steps = [
    {
      number: 1,
      icon: User,
      title: 'Create Your Profile',
      description: 'Start your journey by creating a comprehensive profile with your academic background, interests, and career aspirations.',
      color: 'from-blue-500 to-cyan-500',
      delay: 0
    },
    {
      number: 2,
      icon: Brain,
      title: 'AI Assessment',
      description: 'Take our advanced AI-powered assessments that analyze your cognitive abilities, personality traits, and career preferences.',
      color: 'from-purple-500 to-pink-500',
      delay: 0.2
    },
    {
      number: 3,
      icon: Target,
      title: 'Get Recommendations',
      description: 'Receive personalized career paths, course suggestions, and college recommendations based on your unique profile.',
      color: 'from-green-500 to-blue-500',
      delay: 0.4
    },
    {
      number: 4,
      icon: Trophy,
      title: 'Achieve Success',
      description: 'Follow your optimized timeline, track your progress, and achieve your career goals with our continuous guidance.',
      color: 'from-orange-500 to-red-500',
      delay: 0.6
    }
  ]

  return (
    <section 
      ref={ref}
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 10% 30%, rgba(79, 172, 254, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 90% 70%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)
        `
      }}
    >
      {/* Background Effects */}
      <GlowingOrb size={250} color="#7877c6" className="top-20 right-10" />
      <GlowingOrb size={300} color="#ff77c6" className="bottom-10 left-10" />
      <GlowingOrb size={200} color="#4facfe" className="top-1/3 left-1/4" />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement duration={6} delay={0}>
          <Sparkles className="absolute top-32 right-20 text-blue-400 w-8 h-8 opacity-30" />
        </FloatingElement>
        <FloatingElement duration={4} delay={2}>
          <Zap className="absolute bottom-32 right-32 text-purple-400 w-6 h-6 opacity-40" />
        </FloatingElement>
        <FloatingElement duration={5} delay={1}>
          <Stars className="absolute top-1/2 left-16 text-pink-400 w-7 h-7 opacity-35" />
        </FloatingElement>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6"
            initial={{ scale: 0, rotate: 180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Play className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-purple-300 font-medium">Simple Process</span>
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 tech-font"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-white">How It</span>
            <br />
            <span className="holographic">Works</span>
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Transform your career journey in just four simple steps. Our AI-powered platform 
            guides you from confusion to clarity, from dreams to reality.
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="flex justify-center items-center space-x-8 mt-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                <AnimatedCounter value={10} duration={2} />min
              </div>
              <div className="text-sm text-gray-400">Average Time</div>
            </div>
            <div className="w-px h-12 bg-gray-600" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                <AnimatedCounter value={98} duration={2} />%
              </div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="w-px h-12 bg-gray-600" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                <AnimatedCounter value={50} duration={2} />K+
              </div>
              <div className="text-sm text-gray-400">Students Helped</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            className="btn-futuristic group text-lg px-12 py-4"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(120, 119, 198, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-6 h-6 mr-3 group-hover:animate-pulse" />
            Start Your Journey
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.p 
            className="text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
          >
            Free to start • No credit card required
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
