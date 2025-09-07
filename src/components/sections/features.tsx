'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Brain, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  Users,
  Zap,
  Target,
  Sparkles,
  Award
} from 'lucide-react'
import { AnimatedCard, GlowingOrb, FloatingElement } from '@/components/ui/animated-components'

interface FeatureProps {
  icon: React.ComponentType<any>
  title: string
  description: string
  gradient: string
  delay: number
}

const FeatureCard = ({ icon: Icon, title, description, gradient, delay }: FeatureProps) => {
  return (
    <AnimatedCard delay={delay} className="relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-500" 
           style={{ background: gradient }} />
      
      <div className="relative z-10 p-8">
        <motion.div
          className="mb-6"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </motion.div>
        
        <motion.h3 
          className="text-2xl font-bold mb-4 tech-font"
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

        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </AnimatedCard>
  )
}

export function Features() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Assessment',
      description: 'Advanced artificial intelligence analyzes your cognitive patterns, personality traits, and interests to provide scientifically-backed career recommendations.',
      gradient: 'from-blue-500 to-purple-600',
      delay: 0
    },
    {
      icon: BookOpen,
      title: 'Smart Course Mapping',
      description: 'Discover the perfect educational pathway with our intelligent course recommendation engine that connects your interests to future opportunities.',
      gradient: 'from-green-500 to-blue-500',
      delay: 0.1
    },
    {
      icon: GraduationCap,
      title: 'Elite College Database',
      description: 'Access comprehensive information about top government colleges, admission requirements, and success rates tailored to your academic profile.',
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.2
    },
    {
      icon: Calendar,
      title: 'Timeline Optimization',
      description: 'Never miss crucial deadlines with our smart timeline tracker that sends personalized reminders and preparation schedules.',
      gradient: 'from-orange-500 to-red-500',
      delay: 0.3
    },
    {
      icon: TrendingUp,
      title: 'Career Analytics',
      description: 'Leverage data-driven insights about job market trends, salary projections, and industry growth to make informed decisions.',
      gradient: 'from-cyan-500 to-blue-500',
      delay: 0.4
    },
    {
      icon: Users,
      title: 'Expert Network',
      description: 'Connect with industry professionals, alumni, and career counselors who provide personalized guidance and mentorship.',
      gradient: 'from-pink-500 to-purple-500',
      delay: 0.5
    }
  ]

  return (
    <section 
      ref={ref}
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 40% 80%, rgba(79, 172, 254, 0.15) 0%, transparent 50%)
        `
      }}
    >
      {/* Background Effects */}
      <GlowingOrb size={300} color="#4facfe" className="top-10 left-10" />
      <GlowingOrb size={200} color="#f093fb" className="top-1/4 right-20" />
      <GlowingOrb size={250} color="#43e97b" className="bottom-20 left-1/4" />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement duration={4} delay={0}>
          <Sparkles className="absolute top-20 left-10 text-blue-400 w-6 h-6 opacity-40" />
        </FloatingElement>
        <FloatingElement duration={5} delay={1}>
          <Zap className="absolute top-40 right-20 text-purple-400 w-8 h-8 opacity-30" />
        </FloatingElement>
        <FloatingElement duration={3} delay={2}>
          <Target className="absolute bottom-40 left-20 text-green-400 w-6 h-6 opacity-50" />
        </FloatingElement>
        <FloatingElement duration={4} delay={1.5}>
          <Award className="absolute bottom-20 right-40 text-pink-400 w-7 h-7 opacity-35" />
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
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-300 font-medium">Revolutionary Features</span>
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 tech-font"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="holographic">Next-Gen</span>
            <br />
            <span className="text-white">Career Guidance</span>
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Experience the future of education with our cutting-edge platform that combines 
            artificial intelligence, big data, and human expertise to unlock your true potential.
          </motion.p>

          {/* Animated Underline */}
          <motion.div
            className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mt-8 rounded-full"
            initial={{ width: 0 }}
            animate={inView ? { width: 200 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: feature.delay,
                ease: "easeOut"
              }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            className="btn-futuristic group text-lg px-12 py-4"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(79, 172, 254, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Brain className="w-6 h-6 mr-3 group-hover:animate-pulse" />
            Experience the Future
            <Sparkles className="w-6 h-6 ml-3 group-hover:animate-spin" />
          </motion.button>

          <motion.p 
            className="text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
          >
            Join 50,000+ students already using our platform
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
