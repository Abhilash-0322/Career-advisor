'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export const AnimatedCard = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = 'up' 
}: AnimatedCardProps) => {
  const directions = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: -50 },
    right: { x: 50 }
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction],
        scale: 0.9
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0, 
        scale: 1 
      }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={`futuristic-card ${className}`}
    >
      {children}
    </motion.div>
  )
}

interface GlowButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const GlowButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = ""
}: GlowButtonProps) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
    secondary: "bg-gradient-to-r from-green-500 to-blue-500 text-white",
    outline: "border-2 border-blue-500 text-blue-500 bg-transparent"
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative font-semibold rounded-lg overflow-hidden
        transition-all duration-300 group
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 30px rgba(79, 172, 254, 0.6)"
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </motion.button>
  )
}

interface FloatingElementProps {
  children: ReactNode
  duration?: number
  delay?: number
  amplitude?: number
}

export const FloatingElement = ({ 
  children, 
  duration = 3, 
  delay = 0,
  amplitude = 10 
}: FloatingElementProps) => (
  <motion.div
    animate={{ 
      y: [-amplitude, amplitude, -amplitude],
      rotate: [-2, 2, -2]
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
)

interface TypewriterProps {
  texts: string[]
  speed?: number
  className?: string
}

export const Typewriter = ({ texts, speed = 100, className = "" }: TypewriterProps) => {
  return (
    <motion.span 
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {texts[0]} {/* Simplified for now */}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-blue-400 ml-1"
      >
        |
      </motion.span>
    </motion.span>
  )
}

interface CounterProps {
  value: number
  suffix?: string
  duration?: number
}

export const AnimatedCounter = ({ value, suffix = "", duration = 2 }: CounterProps) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration }}
      >
        {value}
      </motion.span>
      {suffix}
    </motion.span>
  )
}

interface GlowingOrbProps {
  size?: number
  color?: string
  className?: string
}

export const GlowingOrb = ({ 
  size = 100, 
  color = "#00d4ff", 
  className = "" 
}: GlowingOrbProps) => (
  <motion.div
    className={`absolute rounded-full blur-xl opacity-30 pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}, transparent 70%)`
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

interface ParallaxProps {
  children: ReactNode
  offset?: number
  className?: string
}

export const ParallaxElement = ({ children, offset = 50, className = "" }: ParallaxProps) => {
  return (
    <motion.div
      initial={{ y: offset, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const PulseEffect = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <motion.div
    className={className}
    animate={{
      boxShadow: [
        "0 0 0 0 rgba(79, 172, 254, 0.4)",
        "0 0 0 10px rgba(79, 172, 254, 0)",
        "0 0 0 0 rgba(79, 172, 254, 0)"
      ]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
)
