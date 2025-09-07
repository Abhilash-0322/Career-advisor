'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Rocket,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Star,
  Brain,
  Shield,
  Clock,
  Users
} from 'lucide-react'
import { GlowingOrb, FloatingElement, AnimatedCounter } from '@/components/ui/animated-components'

export function FuturisticCTA() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const features = [
    {
      icon: Shield,
      text: "100% Free",
      color: "text-green-400"
    },
    {
      icon: Clock,
      text: "Instant Results",
      color: "text-blue-400"
    },
    {
      icon: Users,
      text: "Expert Support",
      color: "text-purple-400"
    },
    {
      icon: Target,
      text: "Personalized",
      color: "text-pink-400"
    }
  ]

  return (
    <section 
      ref={ref}
      className="py-32 px-4 relative overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(79, 172, 254, 0.1) 0%, 
            rgba(120, 119, 198, 0.15) 25%,
            rgba(255, 119, 198, 0.1) 50%,
            rgba(43, 217, 254, 0.15) 75%,
            rgba(79, 172, 254, 0.1) 100%
          ),
          radial-gradient(ellipse at 50% 0%, rgba(79, 172, 254, 0.2) 0%, transparent 70%),
          radial-gradient(ellipse at 50% 100%, rgba(255, 119, 198, 0.2) 0%, transparent 70%)
        `
      }}
    >
      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79, 172, 254, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79, 172, 254, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Background Effects */}
      <GlowingOrb size={400} color="#4facfe" className="top-10 left-1/4" />
      <GlowingOrb size={300} color="#f093fb" className="bottom-10 right-1/4" />
      <GlowingOrb size={250} color="#43e97b" className="top-1/3 right-10" />
      <GlowingOrb size={350} color="#7877c6" className="bottom-1/3 left-10" />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement duration={6} delay={0}>
          <Sparkles className="absolute top-20 left-20 text-blue-400 w-8 h-8 opacity-40" />
        </FloatingElement>
        <FloatingElement duration={4} delay={1}>
          <Zap className="absolute top-40 right-20 text-purple-400 w-10 h-10 opacity-30" />
        </FloatingElement>
        <FloatingElement duration={5} delay={2}>
          <Star className="absolute bottom-40 left-1/4 text-pink-400 w-7 h-7 opacity-50" />
        </FloatingElement>
        <FloatingElement duration={3} delay={1.5}>
          <Target className="absolute bottom-20 right-1/3 text-green-400 w-9 h-9 opacity-35" />
        </FloatingElement>
        <FloatingElement duration={7} delay={0.5}>
          <Brain className="absolute top-1/2 left-16 text-cyan-400 w-8 h-8 opacity-45" />
        </FloatingElement>
      </div>

      {/* Scan Lines Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 98px,
            rgba(79, 172, 254, 0.03) 100px
          )`
        }}
        animate={{
          backgroundPosition: ['0px', '200px']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Rocket className="w-6 h-6 text-blue-400 mr-3" />
            <span className="text-blue-300 font-semibold text-lg">Ready to Launch Your Career?</span>
          </motion.div>

          {/* Heading */}
          <motion.h2 
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tech-font leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-white">Transform Your</span>
            <br />
            <span className="holographic">Future Today</span>
          </motion.h2>

          {/* Subheading */}
          <motion.p 
            className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Join <span className="text-blue-400 font-bold">50,000+</span> students who have discovered their 
            perfect career path using our revolutionary AI-powered platform. 
            <span className="holographic"> Your dream career awaits.</span>
          </motion.p>

          {/* Features Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <feature.icon className={`w-8 h-8 ${feature.color} mb-3`} />
                <span className="text-white font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.button
              className="btn-futuristic group text-xl px-16 py-5 relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(79, 172, 254, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button Background Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <div className="relative z-10 flex items-center">
                <Rocket className="w-7 h-7 mr-4 group-hover:animate-bounce" />
                Start Your Journey
                <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.button>

            <motion.button
              className="border-2 border-gray-500 text-gray-300 hover:text-white hover:border-white px-12 py-5 rounded-xl font-semibold text-xl transition-all duration-300 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-6 h-6 mr-3 inline group-hover:animate-pulse" />
              Take Free Assessment
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex justify-center items-center space-x-12"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                <AnimatedCounter value={98} duration={2} />%
              </div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="w-px h-16 bg-gray-600" />
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">
                <AnimatedCounter value={5} duration={2} />min
              </div>
              <div className="text-gray-400">Setup Time</div>
            </div>
            <div className="w-px h-16 bg-gray-600" />
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                <AnimatedCounter value={24} duration={2} />/7
              </div>
              <div className="text-gray-400">Support</div>
            </div>
          </motion.div>

          {/* Guarantee */}
          <motion.p 
            className="text-gray-400 mt-8 text-lg"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.3 }}
          >
            ✨ No credit card required • 100% Free forever • Cancel anytime
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom Glow Effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-blue-500/20 to-transparent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: 1.5 }}
      />
    </section>
  )
}
