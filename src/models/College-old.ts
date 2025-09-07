import mongoose from 'mongoose'

export interface ICollege extends mongoose.Document {
  name: string
  code: string
  type: 'government' | 'aided' | 'private'
  affiliation: string
  location: {
    address: string
    city: string
    district: string
    state: string
    pincode: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  contact: {
    phone: string[]
    email: string[]
    website?: string
  }
  courses: mongoose.Types.ObjectId[]
  facilities: {
    hostel: boolean
    library: boolean
    labs: string[]
    sports: string[]
    canteen: boolean
    transport: boolean
    wifi: boolean
    medical: boolean
  }
  admissionInfo: {
    process: string
    cutoffs: {
      course: mongoose.Types.ObjectId
      category: string
      cutoff: number
      year: number
    }[]
    fees: {
      course: mongoose.Types.ObjectId
      amount: number
      breakdown: {
        tuition: number
        hostel?: number
        other?: number
      }
    }[]
  }
  rankings: {
    nirf?: number
    state?: number
    category?: number
  }
  accreditation: {
    naac?: {
      grade: string
      score: number
      validUntil: Date
    }
    nba?: string[]
  }
  studentInfo: {
    totalSeats: number
    reservationQuota: {
      general: number
      obc: number
      sc: number
      st: number
      ews: number
    }
  }
  established: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CollegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
    maxlength: [300, 'College name cannot exceed 300 characters']
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
    enum: ['government', 'aided', 'private']
  },
  affiliation: {
    type: String,
    required: [true, 'Affiliation is required'],
    trim: true
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  contact: {
    phone: [{
      type: String,
      match: [/^\+?\d{10,15}$/, 'Please enter a valid phone number']
    }],
    email: [{
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }],
    website: {
      type: String,
      match: [/^https?:\/\/.+\..+/, 'Please enter a valid website URL']
    }
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  facilities: {
    hostel: { type: Boolean, default: false },
    library: { type: Boolean, default: false },
    labs: [{ type: String, trim: true }],
    sports: [{ type: String, trim: true }],
    canteen: { type: Boolean, default: false },
    transport: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    medical: { type: Boolean, default: false }
  },
  admissionInfo: {
    process: {
      type: String,
      required: [true, 'Admission process is required']
    },
    cutoffs: [{
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      category: {
        type: String,
        enum: ['general', 'obc', 'sc', 'st', 'ews']
      },
      cutoff: Number,
      year: Number
    }],
    fees: [{
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      amount: Number,
      breakdown: {
        tuition: Number,
        hostel: Number,
        other: Number
      }
    }]
  },
  rankings: {
    nirf: Number,
    state: Number,
    category: Number
  },
  accreditation: {
    naac: {
      grade: {
        type: String,
        enum: ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C']
      },
      score: {
        type: Number,
        min: [0, 'NAAC score cannot be negative'],
        max: [4, 'NAAC score cannot exceed 4']
      },
      validUntil: Date
    },
    nba: [{ type: String, trim: true }]
  },
  studentInfo: {
    totalSeats: {
      type: Number,
      min: [0, 'Total seats cannot be negative']
    },
    reservationQuota: {
      general: { type: Number, min: 0 },
      obc: { type: Number, min: 0 },
      sc: { type: Number, min: 0 },
      st: { type: Number, min: 0 },
      ews: { type: Number, min: 0 }
    }
  },
  established: {
    type: Date,
    required: [true, 'Establishment date is required']
  },
  isActive: {
    type: Boolean,
    default: true
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

// Indexes for better query performance
CollegeSchema.index({ 'location.state': 1, 'location.district': 1 })
CollegeSchema.index({ type: 1, isActive: 1 })
CollegeSchema.index({ name: 'text', 'location.city': 'text' })

export default mongoose.models.College || mongoose.model<ICollege>('College', CollegeSchema)
