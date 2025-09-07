import mongoose from 'mongoose'

export interface IAptitudeQuestion extends mongoose.Document {
  category: string
  subcategory: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeLimit: number
  createdAt: Date
  updatedAt: Date
}

const AptitudeQuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Logical Reasoning', 'Numerical Ability', 'Verbal Reasoning', 'Spatial Reasoning', 'Abstract Reasoning']
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required']
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    maxlength: [1000, 'Question cannot exceed 1000 characters']
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: [0, 'Answer index cannot be negative'],
    max: [3, 'Answer index cannot exceed 3']
  },
  explanation: {
    type: String,
    required: [true, 'Explanation is required'],
    maxlength: [500, 'Explanation cannot exceed 500 characters']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  timeLimit: {
    type: Number,
    required: [true, 'Time limit is required'],
    min: [30, 'Time limit must be at least 30 seconds'],
    max: [300, 'Time limit cannot exceed 300 seconds']
  }
}, {
  timestamps: true
})

AptitudeQuestionSchema.index({ category: 1, difficulty: 1 })
AptitudeQuestionSchema.index({ subcategory: 1 })

const AptitudeQuestion = mongoose.models.AptitudeQuestion || mongoose.model<IAptitudeQuestion>('AptitudeQuestion', AptitudeQuestionSchema)
export default AptitudeQuestion
