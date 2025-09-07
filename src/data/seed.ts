import connectDB from '../lib/db.js'
import Course from '../models/Course.js'
import College from '../models/College.js'
import AptitudeQuestion from '../models/AptitudeQuestion.js'

const courses = [
  // Engineering Courses
  {
    title: "Computer Science Engineering",
    code: "CSE",
    category: "Engineering",
    duration: "4 years",
    description: "Study of algorithms, programming languages, software development, and computer systems.",
    eligibility: ["12th with Math, Physics, Chemistry", "JEE Main qualified"],
    careerProspects: [
      { role: "Software Engineer", averageSalary: 800000, growthRate: 15 },
      { role: "Data Scientist", averageSalary: 1200000, growthRate: 25 },
      { role: "AI/ML Engineer", averageSalary: 1500000, growthRate: 30 },
      { role: "Full Stack Developer", averageSalary: 900000, growthRate: 20 }
    ],
    skills: ["Programming", "Data Structures", "Algorithms", "Database Management", "Software Engineering"],
    subjects: ["Programming", "Data Structures", "Computer Networks", "Operating Systems", "Database Systems"],
    jobMarketDemand: "Very High",
    averageSalary: 1000000,
    topRecruiters: ["Google", "Microsoft", "Amazon", "TCS", "Infosys"],
    entrance_exams: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE"]
  },
  {
    title: "Electronics and Communication Engineering",
    code: "ECE",
    category: "Engineering",
    duration: "4 years",
    description: "Study of electronic devices, communication systems, and signal processing.",
    eligibility: ["12th with Math, Physics, Chemistry", "JEE Main qualified"],
    careerProspects: [
      { role: "Electronics Engineer", averageSalary: 600000, growthRate: 12 },
      { role: "VLSI Design Engineer", averageSalary: 800000, growthRate: 18 },
      { role: "Embedded Systems Engineer", averageSalary: 700000, growthRate: 15 },
      { role: "Telecom Engineer", averageSalary: 650000, growthRate: 10 }
    ],
    skills: ["Circuit Design", "Signal Processing", "Embedded Systems", "VLSI Design", "Communication Systems"],
    subjects: ["Electronic Circuits", "Digital Systems", "Communication Systems", "Microprocessors", "Control Systems"],
    jobMarketDemand: "High",
    averageSalary: 700000,
    topRecruiters: ["Intel", "Qualcomm", "Samsung", "ISRO", "DRDO"],
    entrance_exams: ["JEE Main", "JEE Advanced", "GATE"]
  },
  {
    title: "Mechanical Engineering",
    code: "ME",
    category: "Engineering",
    duration: "4 years",
    description: "Study of mechanics, thermodynamics, and manufacturing processes.",
    eligibility: ["12th with Math, Physics, Chemistry", "JEE Main qualified"],
    careerProspects: [
      { role: "Mechanical Engineer", averageSalary: 500000, growthRate: 8 },
      { role: "Design Engineer", averageSalary: 600000, growthRate: 12 },
      { role: "Production Engineer", averageSalary: 550000, growthRate: 10 },
      { role: "Automotive Engineer", averageSalary: 700000, growthRate: 15 }
    ],
    skills: ["CAD/CAM", "Thermodynamics", "Manufacturing", "Design", "Project Management"],
    subjects: ["Thermodynamics", "Fluid Mechanics", "Machine Design", "Manufacturing Processes", "Materials Science"],
    jobMarketDemand: "Moderate",
    averageSalary: 600000,
    topRecruiters: ["Tata Motors", "Mahindra", "L&T", "BHEL", "HAL"],
    entrance_exams: ["JEE Main", "JEE Advanced", "GATE"]
  },

  // Medical Courses
  {
    title: "Bachelor of Medicine and Surgery",
    code: "MBBS",
    category: "Medical",
    duration: "5.5 years",
    description: "Comprehensive medical education covering human anatomy, physiology, and clinical practice.",
    eligibility: ["12th with Physics, Chemistry, Biology", "NEET qualified"],
    careerProspects: [
      { role: "General Physician", averageSalary: 800000, growthRate: 10 },
      { role: "Specialist Doctor", averageSalary: 1500000, growthRate: 15 },
      { role: "Surgeon", averageSalary: 2000000, growthRate: 20 },
      { role: "Medical Researcher", averageSalary: 1000000, growthRate: 12 }
    ],
    skills: ["Medical Knowledge", "Patient Care", "Diagnosis", "Surgery", "Communication"],
    subjects: ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology", "Clinical Medicine"],
    jobMarketDemand: "Very High",
    averageSalary: 1200000,
    topRecruiters: ["AIIMS", "Government Hospitals", "Private Hospitals", "Healthcare Companies"],
    entrance_exams: ["NEET"]
  },
  {
    title: "Bachelor of Dental Surgery",
    code: "BDS",
    category: "Medical",
    duration: "5 years",
    description: "Study of dental health, oral diseases, and dental procedures.",
    eligibility: ["12th with Physics, Chemistry, Biology", "NEET qualified"],
    careerProspects: [
      { role: "Dentist", averageSalary: 600000, growthRate: 8 },
      { role: "Oral Surgeon", averageSalary: 1000000, growthRate: 12 },
      { role: "Orthodontist", averageSalary: 800000, growthRate: 10 },
      { role: "Dental Consultant", averageSalary: 700000, growthRate: 9 }
    ],
    skills: ["Dental Procedures", "Patient Care", "Oral Surgery", "Orthodontics", "Dental Technology"],
    subjects: ["Dental Anatomy", "Oral Pathology", "Orthodontics", "Periodontics", "Oral Surgery"],
    jobMarketDemand: "High",
    averageSalary: 700000,
    topRecruiters: ["Dental Clinics", "Hospitals", "Healthcare Companies", "Government Health Services"],
    entrance_exams: ["NEET"]
  },

  // Business Courses
  {
    title: "Bachelor of Business Administration",
    code: "BBA",
    category: "Business",
    duration: "3 years",
    description: "Comprehensive business education covering management, finance, and marketing.",
    eligibility: ["12th from any stream", "Entrance exam qualified"],
    careerProspects: [
      { role: "Business Analyst", averageSalary: 500000, growthRate: 12 },
      { role: "Marketing Manager", averageSalary: 700000, growthRate: 15 },
      { role: "HR Manager", averageSalary: 600000, growthRate: 10 },
      { role: "Operations Manager", averageSalary: 800000, growthRate: 18 }
    ],
    skills: ["Management", "Leadership", "Communication", "Analytical Thinking", "Strategic Planning"],
    subjects: ["Business Management", "Marketing", "Finance", "Human Resources", "Operations Management"],
    jobMarketDemand: "High",
    averageSalary: 650000,
    topRecruiters: ["Deloitte", "McKinsey", "KPMG", "Accenture", "TCS"],
    entrance_exams: ["DU JAT", "NPAT", "SET", "UGAT"]
  },

  // Arts and Humanities
  {
    title: "Bachelor of Arts in Psychology",
    code: "BA Psychology",
    category: "Arts",
    duration: "3 years",
    description: "Study of human behavior, mental processes, and psychological theories.",
    eligibility: ["12th from any stream"],
    careerProspects: [
      { role: "Clinical Psychologist", averageSalary: 500000, growthRate: 15 },
      { role: "Counselor", averageSalary: 400000, growthRate: 12 },
      { role: "HR Specialist", averageSalary: 450000, growthRate: 10 },
      { role: "Research Psychologist", averageSalary: 600000, growthRate: 18 }
    ],
    skills: ["Psychological Assessment", "Counseling", "Research", "Communication", "Empathy"],
    subjects: ["General Psychology", "Developmental Psychology", "Abnormal Psychology", "Social Psychology", "Research Methods"],
    jobMarketDemand: "Moderate",
    averageSalary: 480000,
    topRecruiters: ["Hospitals", "Clinics", "NGOs", "Educational Institutions", "Corporate HR"],
    entrance_exams: ["DU Entrance", "BHU UET", "Jamia Entrance"]
  },

  // Science Courses
  {
    title: "Bachelor of Science in Biotechnology",
    code: "B.Sc Biotech",
    category: "Science",
    duration: "3 years",
    description: "Application of biological systems and living organisms in technology.",
    eligibility: ["12th with Physics, Chemistry, Biology/Math"],
    careerProspects: [
      { role: "Biotechnologist", averageSalary: 400000, growthRate: 20 },
      { role: "Research Scientist", averageSalary: 600000, growthRate: 25 },
      { role: "Quality Control Analyst", averageSalary: 350000, growthRate: 12 },
      { role: "Bioinformatics Specialist", averageSalary: 700000, growthRate: 30 }
    ],
    skills: ["Laboratory Techniques", "Research", "Data Analysis", "Biotechnology Applications", "Scientific Writing"],
    subjects: ["Cell Biology", "Genetics", "Biochemistry", "Microbiology", "Molecular Biology"],
    jobMarketDemand: "High",
    averageSalary: 500000,
    topRecruiters: ["Biocon", "Dr. Reddy's", "Cipla", "Research Institutes", "Pharmaceutical Companies"],
    entrance_exams: ["DU Entrance", "BHU UET", "IISER Aptitude Test"]
  }
]

const colleges = [
  // IITs
  {
    name: "Indian Institute of Technology Delhi",
    code: "IIT Delhi",
    type: "Government",
    location: {
      city: "New Delhi",
      state: "Delhi",
      coordinates: { lat: 28.5458, lng: 77.1925 }
    },
    establishedYear: 1961,
    affiliation: "Autonomous",
    courses: ["Computer Science Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"],
    facilities: ["Library", "Hostels", "Sports Complex", "Research Labs", "Cafeteria", "Medical Center"],
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
      },
      fees: {
        tuition: 200000,
        hostel: 50000,
        other: 25000
      }
    },
    contact: {
      website: "https://www.iitd.ac.in",
      email: "info@iitd.ac.in",
      phone: "+91-11-2659-1999"
    },
    placements: {
      averagePackage: 1200000,
      highestPackage: 5000000,
      placementPercentage: 95,
      topRecruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs"]
    }
  },
  {
    name: "Indian Institute of Technology Bombay",
    code: "IIT Bombay",
    type: "Government",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      coordinates: { lat: 19.1334, lng: 72.9133 }
    },
    establishedYear: 1958,
    affiliation: "Autonomous",
    courses: ["Computer Science Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"],
    facilities: ["Library", "Hostels", "Sports Complex", "Research Labs", "Cafeteria", "Medical Center"],
    ranking: {
      nirf: 1,
      qs: 172,
      category: "Engineering"
    },
    admissionProcess: {
      entrance_exams: ["JEE Advanced"],
      cutoff: {
        general: 60,
        obc: 80,
        sc: 100,
        st: 120
      },
      fees: {
        tuition: 200000,
        hostel: 50000,
        other: 25000
      }
    },
    contact: {
      website: "https://www.iitb.ac.in",
      email: "info@iitb.ac.in",
      phone: "+91-22-2572-2545"
    },
    placements: {
      averagePackage: 1500000,
      highestPackage: 8000000,
      placementPercentage: 98,
      topRecruiters: ["Google", "Facebook", "Microsoft", "McKinsey"]
    }
  },

  // NITs
  {
    name: "National Institute of Technology Trichy",
    code: "NIT Trichy",
    type: "Government",
    location: {
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      coordinates: { lat: 10.7600, lng: 78.8148 }
    },
    establishedYear: 1964,
    affiliation: "NIT",
    courses: ["Computer Science Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"],
    facilities: ["Library", "Hostels", "Sports Complex", "Research Labs", "Cafeteria"],
    ranking: {
      nirf: 8,
      qs: 801,
      category: "Engineering"
    },
    admissionProcess: {
      entrance_exams: ["JEE Main"],
      cutoff: {
        general: 2000,
        obc: 3000,
        sc: 5000,
        st: 6000
      },
      fees: {
        tuition: 125000,
        hostel: 30000,
        other: 15000
      }
    },
    contact: {
      website: "https://www.nitt.edu",
      email: "info@nitt.edu",
      phone: "+91-431-250-3001"
    },
    placements: {
      averagePackage: 800000,
      highestPackage: 4000000,
      placementPercentage: 90,
      topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture"]
    }
  },

  // Medical Colleges
  {
    name: "All India Institute of Medical Sciences Delhi",
    code: "AIIMS Delhi",
    type: "Government",
    location: {
      city: "New Delhi",
      state: "Delhi",
      coordinates: { lat: 28.5675, lng: 77.2099 }
    },
    establishedYear: 1956,
    affiliation: "Autonomous",
    courses: ["Bachelor of Medicine and Surgery", "Bachelor of Dental Surgery"],
    facilities: ["Hospital", "Library", "Hostels", "Research Centers", "Medical Labs"],
    ranking: {
      nirf: 1,
      qs: 251,
      category: "Medical"
    },
    admissionProcess: {
      entrance_exams: ["NEET"],
      cutoff: {
        general: 720,
        obc: 700,
        sc: 650,
        st: 600
      },
      fees: {
        tuition: 10000,
        hostel: 20000,
        other: 10000
      }
    },
    contact: {
      website: "https://www.aiims.edu",
      email: "info@aiims.edu",
      phone: "+91-11-2659-3333"
    },
    placements: {
      averagePackage: 1000000,
      highestPackage: 2500000,
      placementPercentage: 100,
      topRecruiters: ["Government Hospitals", "Private Hospitals", "Research Institutes"]
    }
  },

  // Business Schools
  {
    name: "Indian Institute of Management Ahmedabad",
    code: "IIM Ahmedabad",
    type: "Government",
    location: {
      city: "Ahmedabad",
      state: "Gujarat",
      coordinates: { lat: 23.0347, lng: 72.5008 }
    },
    establishedYear: 1961,
    affiliation: "Autonomous",
    courses: ["Bachelor of Business Administration"],
    facilities: ["Library", "Hostels", "Business Labs", "Conference Halls", "Sports Complex"],
    ranking: {
      nirf: 1,
      qs: 187,
      category: "Management"
    },
    admissionProcess: {
      entrance_exams: ["CAT"],
      cutoff: {
        general: 99,
        obc: 96,
        sc: 85,
        st: 80
      },
      fees: {
        tuition: 2300000,
        hostel: 100000,
        other: 50000
      }
    },
    contact: {
      website: "https://www.iima.ac.in",
      email: "info@iima.ac.in",
      phone: "+91-79-6632-4658"
    },
    placements: {
      averagePackage: 2500000,
      highestPackage: 7000000,
      placementPercentage: 100,
      topRecruiters: ["McKinsey", "BCG", "Bain", "Goldman Sachs"]
    }
  }
]

const aptitudeQuestions = [
  // Logical Reasoning
  {
    category: "Logical Reasoning",
    subcategory: "Pattern Recognition",
    question: "What comes next in the series: 2, 6, 12, 20, 30, ?",
    options: ["42", "40", "38", "44"],
    correctAnswer: 0,
    explanation: "The differences are 4, 6, 8, 10, so next difference is 12. 30 + 12 = 42",
    difficulty: "Medium",
    timeLimit: 60
  },
  {
    category: "Logical Reasoning",
    subcategory: "Syllogism",
    question: "All roses are flowers. Some flowers are red. Therefore:",
    options: [
      "All roses are red",
      "Some roses are red",
      "Some roses may be red",
      "No roses are red"
    ],
    correctAnswer: 2,
    explanation: "We cannot conclude definitive relationship between roses and red color from given premises",
    difficulty: "Medium",
    timeLimit: 90
  },

  // Numerical Ability
  {
    category: "Numerical Ability",
    subcategory: "Arithmetic",
    question: "If a shirt costs ₹800 after a 20% discount, what was the original price?",
    options: ["₹960", "₹1000", "₹1200", "₹900"],
    correctAnswer: 1,
    explanation: "If 80% = ₹800, then 100% = ₹800 × (100/80) = ₹1000",
    difficulty: "Easy",
    timeLimit: 45
  },
  {
    category: "Numerical Ability",
    subcategory: "Percentage",
    question: "A population increases from 50,000 to 55,000. What is the percentage increase?",
    options: ["10%", "8%", "12%", "15%"],
    correctAnswer: 0,
    explanation: "Increase = 5000, Percentage = (5000/50000) × 100 = 10%",
    difficulty: "Easy",
    timeLimit: 45
  },

  // Verbal Reasoning
  {
    category: "Verbal Reasoning",
    subcategory: "Vocabulary",
    question: "Choose the word that is most similar to 'METICULOUS':",
    options: ["Careless", "Careful", "Quick", "Expensive"],
    correctAnswer: 1,
    explanation: "Meticulous means extremely careful and precise",
    difficulty: "Medium",
    timeLimit: 30
  },
  {
    category: "Verbal Reasoning",
    subcategory: "Reading Comprehension",
    question: "Which of the following best describes the main idea of critical thinking?",
    options: [
      "Accepting all information as true",
      "Analyzing and evaluating information objectively",
      "Memorizing facts quickly",
      "Following others' opinions"
    ],
    correctAnswer: 1,
    explanation: "Critical thinking involves objective analysis and evaluation of information",
    difficulty: "Medium",
    timeLimit: 60
  },

  // Spatial Reasoning
  {
    category: "Spatial Reasoning",
    subcategory: "Mental Rotation",
    question: "If you rotate a 'L' shape 90 degrees clockwise, what shape do you get?",
    options: ["⌐", "Γ", "⌙", "┘"],
    correctAnswer: 1,
    explanation: "Rotating 'L' 90 degrees clockwise gives 'Γ' shape",
    difficulty: "Medium",
    timeLimit: 45
  },

  // Abstract Reasoning
  {
    category: "Abstract Reasoning",
    subcategory: "Pattern Analysis",
    question: "In a sequence where shapes alternate between circle and square, and colors alternate between red and blue, if the 5th element is a red circle, what is the 8th element?",
    options: [
      "Blue circle",
      "Red square",
      "Blue square",
      "Red circle"
    ],
    correctAnswer: 2,
    explanation: "Following the pattern: 5th is red circle, 6th is blue square, 7th is red circle, 8th is blue square",
    difficulty: "Hard",
    timeLimit: 90
  }
]

export async function seedDatabase() {
  try {
    await connectDB()
    
    // Clear existing data
    await Course.deleteMany({})
    await College.deleteMany({})
    await AptitudeQuestion.deleteMany({})
    
    // Insert courses
    const insertedCourses = await Course.insertMany(courses)
    console.log(`Inserted ${insertedCourses.length} courses`)
    
    // Insert colleges
    const insertedColleges = await College.insertMany(colleges)
    console.log(`Inserted ${insertedColleges.length} colleges`)
    
    // Insert aptitude questions
    const insertedQuestions = await AptitudeQuestion.insertMany(aptitudeQuestions)
    console.log(`Inserted ${insertedQuestions.length} aptitude questions`)
    
    console.log('Database seeded successfully!')
    return {
      courses: insertedCourses.length,
      colleges: insertedColleges.length,
      questions: insertedQuestions.length
    }
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}
