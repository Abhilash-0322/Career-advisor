import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  educationLevel: 'class10' | 'class12' | 'graduate' | 'postgraduate'
  interests: string[]
  location: {
    state: string
    district: string
    pincode?: string
  }
  
  // Enhanced fields for AI recommendations
  academicProfile: {
    currentGrade?: string
    subjects?: string[]
    scores?: {
      subject: string
      score: number
      maxScore: number
      percentage: number
    }[]
    gpa?: number
    previousEducation?: {
      institution: string
      degree: string
      year: number
      grade: string
    }[]
  }
  
  careerProfile: {
    careerGoals?: string[]
    preferredIndustries?: string[]
    workPreferences?: {
      workStyle: 'individual' | 'team' | 'mixed'
      environment: 'office' | 'remote' | 'field' | 'mixed'
      travelWillingness: 'none' | 'occasional' | 'frequent'
    }
    salaryExpectations?: {
      min: number
      max: number
      currency: string
    }
  }
  
  skillsProfile: {
    technicalSkills: {
      skill: string
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
      yearsOfExperience?: number
    }[]
    softSkills: string[]
    certifications?: {
      name: string
      provider: string
      dateObtained: Date
      expiryDate?: Date
      credentialId?: string
    }[]
    languages: {
      language: string
      proficiency: 'basic' | 'intermediate' | 'fluent' | 'native'
    }[]
  }
  
  aiRecommendationData: {
    lastUpdated: Date
    personalityType?: string
    learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
    motivationFactors: string[]
    strengthsWeaknesses: {
      strengths: string[]
      weaknesses: string[]
      improvementAreas: string[]
    }
    careerReadinessScore?: number
    recommendationHistory: {
      date: Date
      type: 'course' | 'career' | 'skill'
      recommendations: string[]
      userFeedback?: {
        rating: number
        comments?: string
      }
    }[]
  }
  
  aptitudeResults?: mongoose.Types.ObjectId[]
  preferredStreams?: string[]
  coursesCompleted?: {
    courseId: mongoose.Types.ObjectId
    completionDate: Date
    grade?: string
    certificateUrl?: string
  }[]
  coursesInProgress?: {
    courseId: mongoose.Types.ObjectId
    enrollmentDate: Date
    progressPercentage: number
  }[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  educationLevel: {
    type: String,
    required: [true, 'Education level is required'],
    enum: ['class10', 'class12', 'graduate', 'postgraduate']
  },
  interests: [{
    type: String,
    trim: true
  }],
  location: {
    state: {
      type: String,
      required: [true, 'State is required']
    },
    district: {
      type: String,
      required: [true, 'District is required']
    },
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  aptitudeResults: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AptitudeResult'
  }],
  preferredStreams: [{
    type: String,
    enum: ['science', 'commerce', 'arts', 'vocational', 'engineering', 'medical', 'management']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  const bcrypt = await import('bcryptjs')
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
