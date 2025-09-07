import mongoose from 'mongoose'

export interface ICourse extends mongoose.Document {
  title: string
  code: string
  category: string
  duration: string
  description: string
  eligibility: string[]
  careerProspects: {
    role: string
    averageSalary: number
    growthRate: number
  }[]
  skills: string[]
  subjects: string[]
  jobMarketDemand: string
  averageSalary: number
  topRecruiters: string[]
  entrance_exams: string[]
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Engineering', 'Medical', 'Business', 'Arts', 'Science', 'Commerce', 'Law']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  eligibility: [{
    type: String,
    required: true
  }],
  careerProspects: [{
    role: {
      type: String,
      required: true
    },
    averageSalary: {
      type: Number,
      required: true
    },
    growthRate: {
      type: Number,
      required: true
    }
  }],
  skills: [{
    type: String,
    required: true
  }],
  subjects: [{
    type: String,
    required: true
  }],
  jobMarketDemand: {
    type: String,
    enum: ['Very High', 'High', 'Moderate', 'Low'],
    required: true
  },
  averageSalary: {
    type: Number,
    required: true
  },
  topRecruiters: [{
    type: String,
    required: true
  }],
  entrance_exams: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
})

CourseSchema.index({ title: 'text', description: 'text', skills: 'text' })
CourseSchema.index({ category: 1, jobMarketDemand: 1 })

const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)
export default Course
    enum: ['bachelors', 'masters', 'diploma', 'certificate']
  },
  stream: {
    type: String,
    required: [true, 'Stream is required'],
    enum: ['science', 'commerce', 'arts', 'vocational', 'engineering', 'medical', 'management', 'law', 'education']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [0.5, 'Duration must be at least 6 months'],
    max: [6, 'Duration cannot exceed 6 years']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  eligibility: {
    minimumEducation: {
      type: String,
      required: [true, 'Minimum education is required']
    },
    subjects: [{
      type: String,
      trim: true
    }],
    minimumPercentage: {
      type: Number,
      required: [true, 'Minimum percentage is required'],
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100']
    }
  },
  careerOpportunities: {
    jobRoles: [{
      type: String,
      trim: true
    }],
    averageSalary: {
      entry: {
        type: Number,
        min: [0, 'Salary cannot be negative']
      },
      mid: {
        type: Number,
        min: [0, 'Salary cannot be negative']
      },
      senior: {
        type: Number,
        min: [0, 'Salary cannot be negative']
      }
    },
    industries: [{
      type: String,
      trim: true
    }],
    governmentJobs: [{
      type: String,
      trim: true
    }],
    higherStudyOptions: [{
      type: String,
      trim: true
    }]
  },
  skills: [{
    type: String,
    trim: true
  }],
  colleges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  }],
  popularity: {
    type: Number,
    default: 0,
    min: [0, 'Popularity cannot be negative']
  },
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
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

// Index for search functionality
CourseSchema.index({ name: 'text', description: 'text', stream: 1 })
CourseSchema.index({ stream: 1, degree: 1 })

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)
