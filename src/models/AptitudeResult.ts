import mongoose from 'mongoose'

export interface IAptitudeResult extends mongoose.Document {
  user: mongoose.Types.ObjectId
  testType: 'personality' | 'intelligence' | 'interest' | 'skill'
  responses: {
    questionId: string
    answer: string | number
    timeSpent: number
  }[]
  results: {
    scores: {
      category: string
      score: number
      percentile: number
    }[]
    recommendations: {
      streams: string[]
      courses: mongoose.Types.ObjectId[]
      careerPaths: string[]
    }
    personality: {
      type: string
      traits: string[]
      strengths: string[]
      challenges: string[]
    }
  }
  completedAt: Date
  createdAt: Date
}

const AptitudeResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  testType: {
    type: String,
    required: [true, 'Test type is required'],
    enum: ['personality', 'intelligence', 'interest', 'skill']
  },
  responses: [{
    questionId: {
      type: String,
      required: [true, 'Question ID is required']
    },
    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Answer is required']
    },
    timeSpent: {
      type: Number,
      min: [0, 'Time spent cannot be negative']
    }
  }],
  results: {
    scores: [{
      category: {
        type: String,
        required: [true, 'Category is required']
      },
      score: {
        type: Number,
        required: [true, 'Score is required'],
        min: [0, 'Score cannot be negative'],
        max: [100, 'Score cannot exceed 100']
      },
      percentile: {
        type: Number,
        min: [0, 'Percentile cannot be negative'],
        max: [100, 'Percentile cannot exceed 100']
      }
    }],
    recommendations: {
      streams: [{
        type: String,
        enum: ['science', 'commerce', 'arts', 'vocational', 'engineering', 'medical', 'management']
      }],
      courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }],
      careerPaths: [{
        type: String,
        trim: true
      }]
    },
    personality: {
      type: {
        type: String,
        trim: true
      },
      traits: [{
        type: String,
        trim: true
      }],
      strengths: [{
        type: String,
        trim: true
      }],
      challenges: [{
        type: String,
        trim: true
      }]
    }
  },
  completedAt: {
    type: Date,
    required: [true, 'Completion time is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index for user's test history
AptitudeResultSchema.index({ user: 1, testType: 1, completedAt: -1 })

export default mongoose.models.AptitudeResult || mongoose.model<IAptitudeResult>('AptitudeResult', AptitudeResultSchema)
