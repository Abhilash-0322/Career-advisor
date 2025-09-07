'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Star,
  Quote,
  User,
  Sparkles,
  Heart,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import { AnimatedCard, GlowingOrb, FloatingElement } from '@/components/ui/animated-components'
import Image from 'next/image'

interface TestimonialProps {
  name: string
  role: string
  university: string
  content: string
  rating: number
  image: string
  delay: number
  color: string
}

const TestimonialCard = ({ name, role, university, content, rating, image, delay, color }: TestimonialProps) => {
  return (
    <AnimatedCard delay={delay} className="relative overflow-hidden group h-full">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <div className="relative z-10 p-8">
        {/* Quote Icon */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.5 }}
        >
          <Quote className="w-8 h-8 text-blue-400 opacity-60" />
        </motion.div>

        {/* Content */}
        <motion.p 
          className="text-gray-300 leading-relaxed mb-6 text-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
        >
          "{content}"
        </motion.p>

        {/* Rating */}
        <motion.div 
          className="flex items-center mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.4 }}
        >
          {[...Array(rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.5 + (i * 0.1) }}
            >
              <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
            </motion.div>
          ))}
        </motion.div>

        {/* User Info */}
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.6 }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg">{name}</h4>
            <p className="text-gray-400 text-sm">{role}</p>
            <p className="text-blue-400 text-sm">{university}</p>
          </div>
        </motion.div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 border border-blue-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: '0 0 30px rgba(79, 172, 254, 0.2)'
          }}
        />
      </div>
    </AnimatedCard>
  )
}

export function Testimonials() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Engineering Student",
      university: "IIT Delhi",
      content: "This platform completely transformed my career planning. The AI assessment revealed interests I didn't even know I had, and now I'm pursuing my dream in robotics engineering!",
      rating: 5,
      image: "/testimonial1.jpg",
      delay: 0,
      color: "from-blue-500 to-purple-600"
    },
    {
      name: "Rahul Patel",
      role: "Medical Aspirant",
      university: "AIIMS Mumbai",
      content: "The timeline tracker kept me on track for every important deadline. Without this platform, I would have missed crucial NEET preparation milestones. Absolutely game-changing!",
      rating: 5,
      image: "/testimonial2.jpg",
      delay: 0.2,
      color: "from-green-500 to-blue-500"
    },
    {
      name: "Ananya Gupta",
      role: "Commerce Graduate",
      university: "Delhi University",
      content: "I was confused between CA and MBA. The detailed career analytics and salary projections helped me make an informed decision. Now I'm confidently pursuing my MBA!",
      rating: 5,
      image: "/testimonial3.jpg",
      delay: 0.4,
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Arjun Singh",
      role: "Arts Student",
      university: "JNU Delhi",
      content: "Being from an arts background, I felt limited in career options. This platform opened my eyes to countless opportunities in media, design, and digital marketing!",
      rating: 5,
      image: "/testimonial4.jpg",
      delay: 0.6,
      color: "from-orange-500 to-red-500"
    },
    {
      name: "Sneha Krishnan",
      role: "Tech Enthusiast",
      university: "NIT Trichy",
      content: "The expert network feature connected me with industry professionals who guided my transition into AI/ML. The mentorship was invaluable for my career growth!",
      rating: 5,
      image: "/testimonial5.jpg",
      delay: 0.8,
      color: "from-cyan-500 to-blue-500"
    },
    {
      name: "Vikram Reddy",
      role: "Startup Founder",
      university: "IIM Bangalore",
      content: "Even as an entrepreneur, the platform's market analysis and trend insights help me understand emerging career fields for my team. Exceptional data-driven approach!",
      rating: 5,
      image: "/testimonial6.jpg",
      delay: 1.0,
      color: "from-pink-500 to-purple-500"
    }
  ]

  return (
    <section 
      ref={ref}
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(79, 172, 254, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 70%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)
        `
      }}
    >
      {/* Background Effects */}
      <GlowingOrb size={200} color="#4facfe" className="top-32 left-20" />
      <GlowingOrb size={300} color="#f093fb" className="bottom-20 right-10" />
      <GlowingOrb size={250} color="#43e97b" className="top-20 right-1/4" />

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement duration={5} delay={0}>
          <Heart className="absolute top-24 left-32 text-pink-400 w-6 h-6 opacity-30" />
        </FloatingElement>
        <FloatingElement duration={4} delay={1}>
          <CheckCircle className="absolute bottom-32 left-20 text-green-400 w-7 h-7 opacity-40" />
        </FloatingElement>
        <FloatingElement duration={6} delay={2}>
          <TrendingUp className="absolute top-40 right-32 text-blue-400 w-8 h-8 opacity-35" />
        </FloatingElement>
        <FloatingElement duration={3} delay={1.5}>
          <Sparkles className="absolute bottom-40 right-20 text-purple-400 w-6 h-6 opacity-45" />
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
            className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Star className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-300 font-medium">Success Stories</span>
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-6xl font-bold mb-6 tech-font"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-white">Transforming</span>
            <br />
            <span className="holographic">Lives</span>
          </motion.h2>

          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Hear from thousands of students who discovered their true potential and achieved 
            their dreams with our revolutionary career guidance platform.
          </motion.p>

          {/* Stats Bar */}
          <motion.div 
            className="flex justify-center items-center space-x-8 mt-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">4.9★</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-gray-600" />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">98%</div>
              <div className="text-sm text-gray-400">Satisfaction Rate</div>
            </div>
            <div className="w-px h-12 bg-gray-600" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">25K+</div>
              <div className="text-sm text-gray-400">Success Stories</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: testimonial.delay,
                ease: "easeOut"
              }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.button
            className="btn-futuristic group text-lg px-12 py-4"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(255, 119, 198, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Star className="w-6 h-6 mr-3 group-hover:animate-spin" />
            Join the Success Stories
            <Sparkles className="w-6 h-6 ml-3 group-hover:animate-pulse" />
          </motion.button>

          <motion.p 
            className="text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.4 }}
          >
            Start your transformation today
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
