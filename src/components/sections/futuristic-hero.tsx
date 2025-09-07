'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap, Brain, Rocket, Target } from 'lucide-react'
import Link from 'next/link'

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
)

const GlowingOrb = ({ size = 100, color = "blue", left = "10%", top = "20%" }: {
  size?: number
  color?: string
  left?: string
  top?: string
}) => (
  <motion.div
    className={`absolute rounded-full blur-xl opacity-30`}
    style={{
      width: size,
      height: size,
      left,
      top,
      background: `radial-gradient(circle, var(--neon-${color}), transparent 70%)`
    }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
)

const TypewriterText = ({ texts, speed = 100 }: { texts: string[], speed?: number }) => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex]
      
      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1))
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentIndex((currentIndex + 1) % texts.length)
        }
      } else {
        setCurrentText(current.substring(0, currentText.length + 1))
        if (currentText === current) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [currentText, currentIndex, isDeleting, texts, speed])

  return (
    <span className="holographic tech-font">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-neon-blue"
      >
        |
      </motion.span>
    </span>
  )
}

const ParticleField = () => {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{x: number, y: number, duration: number, delay: number}>>([])

  useEffect(() => {
    setMounted(true)
    // Initialize particles only on client side
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 bg-neon-blue rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 0
          }}
          animate={{
            y: -800,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

export function FuturisticHero() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -100])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }

  const heroTexts = [
    "Future Careers",
    "AI-Powered Guidance", 
    "Smart Decisions",
    "Your Success"
  ]

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden matrix-bg scan-lines"
    >
      {/* Animated Background */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute inset-0 z-0"
      >
        <GlowingOrb size={200} color="blue" left="10%" top="20%" />
        <GlowingOrb size={150} color="purple" left="80%" top="10%" />
        <GlowingOrb size={120} color="green" left="70%" top="70%" />
        <GlowingOrb size={180} color="pink" left="20%" top="80%" />
      </motion.div>

      {/* Particle Field */}
      <ParticleField />

      {/* Main Content */}
      <motion.div
        style={{ y: y2, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-7xl mx-auto px-4 text-center"
      >
        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingElement delay={0}>
            <Brain className="absolute top-10 left-10 text-neon-blue w-8 h-8 opacity-50" />
          </FloatingElement>
          <FloatingElement delay={1}>
            <Rocket className="absolute top-20 right-20 text-neon-purple w-10 h-10 opacity-60" />
          </FloatingElement>
          <FloatingElement delay={2}>
            <Target className="absolute bottom-20 left-20 text-neon-green w-6 h-6 opacity-40" />
          </FloatingElement>
          <FloatingElement delay={1.5}>
            <Zap className="absolute bottom-10 right-10 text-neon-pink w-8 h-8 opacity-50" />
          </FloatingElement>
        </div>

        {/* Main Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 tech-font leading-tight"
            initial={{ scale: 0.5, rotateX: -180 }}
            animate={{ scale: 1, rotateX: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              duration: 1.5 
            }}
          >
            <span className="block text-gradient neon-text">
              Discover
            </span>
            <TypewriterText texts={heroTexts} speed={150} />
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 1 }}
            className="h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green mx-auto max-w-md mb-8"
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Harness the power of <span className="text-neon-blue font-semibold">artificial intelligence</span> to 
          unlock your potential and navigate the future of education with 
          <span className="text-neon-purple font-semibold"> precision</span> and 
          <span className="text-neon-green font-semibold"> confidence</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link href="/aptitude">
            <motion.button
              className="btn-futuristic group"
              whileHover={{ 
                scale: 1.05,
                rotateZ: 1
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>

          <Link href="/dashboard">
            <motion.button
              className="px-8 py-3 font-semibold text-gray-300 border-2 border-gray-600 rounded-lg hover:border-neon-green hover:text-neon-green transition-all duration-300 group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(104, 211, 145, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-5 h-5 mr-2 inline group-hover:text-neon-green" />
              Explore Dashboard
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Counter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 futuristic-card p-8 max-w-4xl mx-auto"
        >
          {[
            { number: "50000", label: "Students Guided", suffix: "+" },
            { number: "2500", label: "Colleges Listed", suffix: "+" },
            { number: "100", label: "Career Paths", suffix: "+" },
            { number: "95", label: "Success Rate", suffix: "%" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ 
                delay: index * 0.2 + 1.5,
                type: "spring",
                stiffness: 100
              }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-neon-blue tech-font mb-2"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.2 + 2 }}
              >
                {inView && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 2 }}
                  >
                    {stat.number}{stat.suffix}
                  </motion.span>
                )}
              </motion.div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-neon-blue rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-neon-blue rounded-full mt-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
