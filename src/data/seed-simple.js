const mongoose = require('mongoose')

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/career-adv'

// Simple course schema
const CourseSchema = new mongoose.Schema({
  title: String,
  code: String,
  category: String,
  duration: String,
  description: String,
  eligibility: [String],
  careerProspects: [{
    role: String,
    averageSalary: Number,
    growthRate: Number
  }],
  skills: [String],
  subjects: [String],
  jobMarketDemand: String,
  averageSalary: Number,
  topRecruiters: [String],
  entrance_exams: [String]
}, { timestamps: true })

// Simple college schema
const CollegeSchema = new mongoose.Schema({
  name: String,
  code: String,
  type: String,
  location: {
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  establishedYear: Number,
  affiliation: String,
  courses: [String],
  facilities: [String],
  ranking: {
    nirf: Number,
    qs: Number,
    category: String
  },
  admissionProcess: {
    entrance_exams: [String],
    cutoff: {
      general: Number,
      obc: Number,
      sc: Number,
      st: Number
    }
  },
  placement: {
    averagePackage: Number,
    highestPackage: Number,
    placementPercentage: Number,
    topRecruiters: [String]
  },
  fees: {
    tuition: Number,
    hostel: Number,
    total: Number
  }
}, { timestamps: true })

// Simple aptitude question schema
const AptitudeQuestionSchema = new mongoose.Schema({
  category: String,
  subcategory: String,
  question: String,
  options: [String],
  correctAnswer: Number,
  explanation: String,
  difficulty: String,
  timeLimit: Number
}, { timestamps: true })

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema)
const College = mongoose.models.College || mongoose.model('College', CollegeSchema)
const AptitudeQuestion = mongoose.models.AptitudeQuestion || mongoose.model('AptitudeQuestion', AptitudeQuestionSchema)

const sampleCourses = [
  {
    title: "Computer Science Engineering",
    code: "CSE",
    category: "Engineering",
    duration: "4 years",
    description: "Comprehensive program covering software development, algorithms, and computing systems",
    eligibility: ["10+2 with Physics, Chemistry, Mathematics", "JEE Main/Advanced"],
    careerProspects: [
      { role: "Software Engineer", averageSalary: 800000, growthRate: 15 },
      { role: "Data Scientist", averageSalary: 1200000, growthRate: 25 },
      { role: "Product Manager", averageSalary: 1500000, growthRate: 20 }
    ],
    skills: ["Programming", "Problem Solving", "Data Structures", "Algorithms"],
    subjects: ["Programming", "Data Structures", "Operating Systems", "Database Management"],
    jobMarketDemand: "Very High",
    averageSalary: 800000,
    topRecruiters: ["Google", "Microsoft", "Amazon", "TCS", "Infosys"],
    entrance_exams: ["JEE Main", "JEE Advanced", "BITSAT"]
  },
  {
    title: "Mechanical Engineering",
    code: "ME",
    category: "Engineering",
    duration: "4 years",
    description: "Core engineering discipline focusing on design, manufacturing, and maintenance of mechanical systems",
    eligibility: ["10+2 with Physics, Chemistry, Mathematics", "JEE Main/Advanced"],
    careerProspects: [
      { role: "Design Engineer", averageSalary: 600000, growthRate: 12 },
      { role: "Project Manager", averageSalary: 1000000, growthRate: 18 },
      { role: "Research Engineer", averageSalary: 800000, growthRate: 15 }
    ],
    skills: ["CAD/CAM", "Problem Solving", "Project Management", "Manufacturing"],
    subjects: ["Thermodynamics", "Fluid Mechanics", "Machine Design", "Manufacturing"],
    jobMarketDemand: "High",
    averageSalary: 600000,
    topRecruiters: ["Tata Motors", "Mahindra", "L&T", "BHEL", "Siemens"],
    entrance_exams: ["JEE Main", "JEE Advanced", "GATE"]
  },
  {
    title: "Bachelor of Medicine",
    code: "MBBS",
    category: "Medical",
    duration: "5.5 years",
    description: "Professional degree in medicine and surgery",
    eligibility: ["10+2 with Physics, Chemistry, Biology", "NEET"],
    careerProspects: [
      { role: "General Physician", averageSalary: 800000, growthRate: 10 },
      { role: "Specialist Doctor", averageSalary: 1500000, growthRate: 15 },
      { role: "Surgeon", averageSalary: 2000000, growthRate: 12 }
    ],
    skills: ["Medical Knowledge", "Patient Care", "Decision Making", "Communication"],
    subjects: ["Anatomy", "Physiology", "Pathology", "Pharmacology"],
    jobMarketDemand: "Very High",
    averageSalary: 800000,
    topRecruiters: ["AIIMS", "Apollo", "Fortis", "Max Healthcare", "Government Hospitals"],
    entrance_exams: ["NEET"]
  }
]

const sampleColleges = [
  {
    name: "Indian Institute of Technology Delhi",
    code: "IIT-D",
    type: "Government",
    location: {
      city: "New Delhi",
      state: "Delhi",
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    establishedYear: 1961,
    affiliation: "Autonomous",
    courses: ["Computer Science Engineering", "Mechanical Engineering", "Electrical Engineering"],
    facilities: ["Library", "Hostels", "Sports Complex", "Research Labs"],
    ranking: {
      nirf: 2,
      qs: 185,
      category: "Engineering"
    },
    admissionProcess: {
      entrance_exams: ["JEE Advanced"],
      cutoff: {
        general: 150,
        obc: 140,
        sc: 120,
        st: 110
      }
    },
    placement: {
      averagePackage: 1800000,
      highestPackage: 5000000,
      placementPercentage: 95,
      topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs"]
    },
    fees: {
      tuition: 200000,
      hostel: 50000,
      total: 250000
    }
  },
  {
    name: "All India Institute of Medical Sciences Delhi",
    code: "AIIMS-D",
    type: "Government",
    location: {
      city: "New Delhi",
      state: "Delhi",
      coordinates: { lat: 28.5672, lng: 77.2100 }
    },
    establishedYear: 1956,
    affiliation: "Autonomous",
    courses: ["MBBS", "MD", "MS", "DM"],
    facilities: ["Hospital", "Research Labs", "Library", "Hostels"],
    ranking: {
      nirf: 1,
      category: "Medical"
    },
    admissionProcess: {
      entrance_exams: ["NEET"],
      cutoff: {
        general: 720,
        obc: 710,
        sc: 680,
        st: 650
      }
    },
    placement: {
      averagePackage: 1200000,
      highestPackage: 3000000,
      placementPercentage: 100,
      topRecruiters: ["Government Hospitals", "Private Hospitals", "Research Institutes"]
    },
    fees: {
      tuition: 5000,
      hostel: 15000,
      total: 20000
    }
  }
]

const sampleQuestions = [
  {
    category: "Logical Reasoning",
    subcategory: "Pattern Recognition",
    question: "What comes next in the series: 2, 6, 12, 20, 30, ?",
    options: ["42", "40", "38", "44"],
    correctAnswer: 0,
    explanation: "The differences are 4, 6, 8, 10, so next difference is 12. 30 + 12 = 42",
    difficulty: "Medium",
    timeLimit: 120
  },
  {
    category: "Numerical Ability",
    subcategory: "Arithmetic",
    question: "If a train travels 60 km/h for 3 hours, how far does it travel?",
    options: ["180 km", "160 km", "200 km", "150 km"],
    correctAnswer: 0,
    explanation: "Distance = Speed × Time = 60 × 3 = 180 km",
    difficulty: "Easy",
    timeLimit: 90
  },
  {
    category: "Verbal Reasoning",
    subcategory: "Reading Comprehension",
    question: "Choose the word most similar in meaning to 'ABUNDANT':",
    options: ["Scarce", "Plentiful", "Minimal", "Limited"],
    correctAnswer: 1,
    explanation: "Abundant means existing in large quantities, which is similar to plentiful",
    difficulty: "Easy",
    timeLimit: 60
  }
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Course.deleteMany({})
    await College.deleteMany({})
    await AptitudeQuestion.deleteMany({})
    console.log('🧹 Cleared existing data')

    // Insert sample data
    await Course.insertMany(sampleCourses)
    console.log('📚 Inserted courses')

    await College.insertMany(sampleColleges)
    console.log('🏫 Inserted colleges')

    await AptitudeQuestion.insertMany(sampleQuestions)
    console.log('❓ Inserted aptitude questions')

    console.log('✅ Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
