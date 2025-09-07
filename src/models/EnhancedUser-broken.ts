import mongoose from 'mongoose'

export interface IEnhancedUser extends mongoose.Document {
  name: string
  email: string
  password: string
  role?: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  educationLevel?: string
  interests?: string[]
  location?: {
    state?: string
    district?: string
    pincode?: string
  }
  
  // Enhanced fields for AI recommendations
  academicProfile: {
    educationLevel: string
    grades: { [key: string]: string }
    gpa?: number
    standardizedTestScores: { [key: string]: number }
  }
  
  careerProfile: {
    goals: string[]
    interestedIndustries: string[]
    preferredWorkStyle: string
    salaryExpectations?: string
    careerStage: string
  }
  
  skillsProfile: {
    technicalSkills: string[]
    softSkills: string[]
    certifications: string[]
    languages: string[]
    skillGaps: string[]
  }
  
  aiRecommendationData: {
    lastUpdated: Date
    personalityType?: string
    learningStyle?: string
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
  
  // Methods
  updateAIData(data: any): void
  addRecommendation(type: string, recommendations: string[]): void
}

const EnhancedUserSchema = new mongoose.Schema({
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
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    default: 'student'
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  educationLevel: {
    type: String,
    default: ''
  },
  interests: [{
    type: String,
    trim: true
  }],
  location: {
    state: String,
    district: String,
    pincode: String
  },
  
  // Enhanced AI-focused profiles
  academicProfile: {
    educationLevel: {
      type: String,
      default: ''
    },
    grades: {
      type: Map,
      of: String,
      default: {}
    },
    gpa: Number,
    standardizedTestScores: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  
  careerProfile: {
    goals: [{
      type: String,
      trim: true
    }],
    interestedIndustries: [{
      type: String,
      trim: true
    }],
    preferredWorkStyle: {
      type: String,
      default: ''
    },
    salaryExpectations: String,
    careerStage: {
      type: String,
      default: ''
    }
  },
  
  skillsProfile: {
    technicalSkills: [{
      type: String,
      trim: true
    }],
    softSkills: [{
      type: String,
      trim: true
    }],
    certifications: [{
      type: String,
      trim: true
    }],
    languages: [{
      type: String,
      trim: true
    }],
    skillGaps: [{
      type: String,
      trim: true
    }]
  },
  
  aiRecommendationData: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    personalityType: {
      type: String,
      default: ''
    },
    learningStyle: {
      type: String,
      default: ''
    },
    recommendationHistory: [{
      date: {
        type: Date,
        default: Date.now
      },
      type: {
        type: String,
        enum: ['course', 'career', 'skill'],
        required: true
      },
      recommendations: [{
        type: String,
        trim: true
      }],
      userFeedback: {
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        comments: String
      }
    }]
  },
  
  aptitudeResults: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AptitudeResult'
  }],
  
  coursesCompleted: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    completionDate: {
      type: Date,
      required: true
    },
    grade: String,
    certificateUrl: String
  }],
  
  coursesInProgress: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Instance methods
EnhancedUserSchema.methods.updateAIData = function(data: any) {
  this.aiRecommendationData.personalityType = data.personalityType || this.aiRecommendationData.personalityType
  this.aiRecommendationData.learningStyle = data.learningStyle || this.aiRecommendationData.learningStyle
  this.aiRecommendationData.lastUpdated = new Date()
  return this.save()
}

EnhancedUserSchema.methods.addRecommendation = function(type: string, recommendations: string[]) {
  this.aiRecommendationData.recommendationHistory.push({
    date: new Date(),
    type,
    recommendations
  })
  
  // Keep only last 50 recommendations to prevent bloat
  if (this.aiRecommendationData.recommendationHistory.length > 50) {
    this.aiRecommendationData.recommendationHistory = this.aiRecommendationData.recommendationHistory.slice(-50)
  }
  
  return this.save()
}

// Indexes for better performance
EnhancedUserSchema.index({ email: 1 })
EnhancedUserSchema.index({ 'careerProfile.interestedIndustries': 1 })
EnhancedUserSchema.index({ 'skillsProfile.technicalSkills': 1 })
EnhancedUserSchema.index({ educationLevel: 1 })

const EnhancedUser = mongoose.models.EnhancedUser || mongoose.model<IEnhancedUser>('EnhancedUser', EnhancedUserSchema)

export default EnhancedUser
    },
    pincode: String
  },
  
  // Enhanced fields for AI recommendations
  academicProfile: {
    currentGrade: String,
    subjects: [String],
    scores: [{
      subject: String,
      score: Number,
      maxScore: Number,
      percentage: Number
    }],
    gpa: Number,
    previousEducation: [{
      institution: String,
      degree: String,
      year: Number,
      grade: String
    }]
  },
  
  careerProfile: {
    careerGoals: [String],
    preferredIndustries: [String],
    workPreferences: {
      workStyle: {
        type: String,
        enum: ['individual', 'team', 'mixed']
      },
      environment: {
        type: String,
        enum: ['office', 'remote', 'field', 'mixed']
      },
      travelWillingness: {
        type: String,
        enum: ['none', 'occasional', 'frequent']
      }
    },
    salaryExpectations: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    }
  },
  
  skillsProfile: {
    technicalSkills: [{
      skill: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
      },
      yearsOfExperience: Number
    }],
    softSkills: [String],
    certifications: [{
      name: String,
      provider: String,
      dateObtained: Date,
      expiryDate: Date,
      credentialId: String
    }],
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['basic', 'intermediate', 'fluent', 'native']
      }
    }]
  },
  
  aiRecommendationData: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    personalityType: String,
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'reading']
    },
    motivationFactors: [String],
    strengthsWeaknesses: {
      strengths: [String],
      weaknesses: [String],
      improvementAreas: [String]
    },
    careerReadinessScore: Number,
    recommendationHistory: [{
      date: {
        type: Date,
        default: Date.now
      },
      type: {
        type: String,
        enum: ['course', 'career', 'skill']
      },
      recommendations: [String],
      userFeedback: {
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        comments: String
      }
    }]
  },
  
  aptitudeResults: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AptitudeResult'
  }],
  preferredStreams: [String],
  coursesCompleted: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    completionDate: Date,
    grade: String,
    certificateUrl: String
  }],
  coursesInProgress: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrollmentDate: Date,
    progressPercentage: {
      type: Number,
      min: 0,
      max: 100
    }
  }]
}, {
  timestamps: true
})

// Pre-save middleware to hash password
EnhancedUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  const bcrypt = await import('bcryptjs')
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Method to compare passwords
EnhancedUserSchema.methods.comparePassword = async function(candidatePassword: string) {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(candidatePassword, this.password)
}

// Method to update AI recommendation data
EnhancedUserSchema.methods.updateAIData = function(data: any) {
  this.aiRecommendationData.lastUpdated = new Date()
  Object.assign(this.aiRecommendationData, data)
  return this.save()
}

// Method to add recommendation to history
EnhancedUserSchema.methods.addRecommendation = function(type: string, recommendations: string[]) {
  this.aiRecommendationData.recommendationHistory.push({
    date: new Date(),
    type,
    recommendations
  })
  this.aiRecommendationData.lastUpdated = new Date()
  return this.save()
}

export default mongoose.models.EnhancedUser || mongoose.model<IEnhancedUser>('EnhancedUser', EnhancedUserSchema)
