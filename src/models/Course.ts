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
