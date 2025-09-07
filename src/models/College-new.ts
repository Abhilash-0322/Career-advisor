import mongoose from 'mongoose'

export interface ICollege extends mongoose.Document {
  name: string
  code: string
  type: 'Government' | 'Private' | 'Semi-Government'
  location: {
    city: string
    state: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  establishedYear: number
  affiliation: string
  courses: string[]
  facilities: string[]
  ranking: {
    nirf?: number
    qs?: number
    category: string
  }
  admissionProcess: {
    entrance_exams: string[]
    cutoff: {
      general: number
      obc: number
      sc: number
      st: number
    }
    fees: {
      tuition: number
      hostel: number
      other: number
    }
  }
  contact: {
    website: string
    email: string
    phone: string
  }
  placements: {
    averagePackage: number
    highestPackage: number
    placementPercentage: number
    topRecruiters: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const CollegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
    maxlength: [200, 'College name cannot exceed 200 characters']
  },
  code: {
    type: String,
    required: [true, 'College code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'College type is required'],
    enum: ['Government', 'Private', 'Semi-Government']
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  establishedYear: {
    type: Number,
    required: [true, 'Established year is required']
  },
  affiliation: {
    type: String,
    required: [true, 'Affiliation is required']
  },
  courses: [{
    type: String,
    required: true
  }],
  facilities: [{
    type: String,
    required: true
  }],
  ranking: {
    nirf: {
      type: Number
    },
    qs: {
      type: Number
    },
    category: {
      type: String,
      required: true
    }
  },
  admissionProcess: {
    entrance_exams: [{
      type: String,
      required: true
    }],
    cutoff: {
      general: {
        type: Number,
        required: true
      },
      obc: {
        type: Number,
        required: true
      },
      sc: {
        type: Number,
        required: true
      },
      st: {
        type: Number,
        required: true
      }
    },
    fees: {
      tuition: {
        type: Number,
        required: true
      },
      hostel: {
        type: Number,
        required: true
      },
      other: {
        type: Number,
        required: true
      }
    }
  },
  contact: {
    website: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  placements: {
    averagePackage: {
      type: Number,
      required: true
    },
    highestPackage: {
      type: Number,
      required: true
    },
    placementPercentage: {
      type: Number,
      required: true
    },
    topRecruiters: [{
      type: String,
      required: true
    }]
  }
}, {
  timestamps: true
})

CollegeSchema.index({ name: 'text', 'location.city': 1, 'location.state': 1 })
CollegeSchema.index({ type: 1, courses: 1 })
CollegeSchema.index({ 'ranking.nirf': 1, 'ranking.category': 1 })

const College = mongoose.models.College || mongoose.model<ICollege>('College', CollegeSchema)
export default College
