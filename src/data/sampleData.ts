// Sample data for development and testing

export const sampleCourses = [
  {
    name: "Bachelor of Technology (Computer Science)",
    code: "B.TECH-CS",
    degree: "bachelors",
    stream: "engineering",
    duration: 4,
    description: "A comprehensive 4-year program focusing on computer science fundamentals, programming, software engineering, and emerging technologies.",
    eligibility: {
      minimumEducation: "Class 12 with Physics, Chemistry, Mathematics",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      minimumPercentage: 75
    },
    careerOpportunities: {
      jobRoles: [
        "Software Engineer",
        "Data Scientist",
        "Web Developer",
        "Mobile App Developer",
        "System Analyst",
        "DevOps Engineer",
        "AI/ML Engineer"
      ],
      averageSalary: {
        entry: 400000,
        mid: 800000,
        senior: 1500000
      },
      industries: [
        "Information Technology",
        "Software Development",
        "Consulting",
        "Banking & Finance",
        "E-commerce",
        "Gaming"
      ],
      governmentJobs: [
        "ISRO Scientist",
        "DRDO Scientist",
        "Railways Technical Officer",
        "Banking IT Officer",
        "Digital India Officer"
      ],
      higherStudyOptions: [
        "M.Tech Computer Science",
        "MBA Technology",
        "MS in Computer Science (Abroad)",
        "PhD in Computer Science"
      ]
    },
    skills: [
      "Programming Languages",
      "Data Structures & Algorithms",
      "Database Management",
      "Web Technologies",
      "Software Engineering",
      "Computer Networks",
      "Operating Systems"
    ],
    popularity: 95,
    difficultyLevel: "medium"
  },
  {
    name: "Bachelor of Commerce",
    code: "B.COM",
    degree: "bachelors",
    stream: "commerce",
    duration: 3,
    description: "A 3-year undergraduate program covering accounting, finance, business law, economics, and management principles.",
    eligibility: {
      minimumEducation: "Class 12 with Commerce/Science/Arts",
      subjects: ["Any"],
      minimumPercentage: 60
    },
    careerOpportunities: {
      jobRoles: [
        "Accountant",
        "Financial Analyst",
        "Tax Consultant",
        "Auditor",
        "Banking Officer",
        "Insurance Agent",
        "Business Analyst"
      ],
      averageSalary: {
        entry: 250000,
        mid: 500000,
        senior: 1000000
      },
      industries: [
        "Banking & Finance",
        "Accounting Firms",
        "Insurance",
        "Consulting",
        "Government",
        "Corporate Sector"
      ],
      governmentJobs: [
        "Bank PO",
        "SSC CGL",
        "Income Tax Officer",
        "Customs Officer",
        "RBI Assistant"
      ],
      higherStudyOptions: [
        "M.Com",
        "MBA Finance",
        "CA (Chartered Accountant)",
        "CS (Company Secretary)",
        "CMA (Cost Management Accountant)"
      ]
    },
    skills: [
      "Accounting",
      "Financial Analysis",
      "Business Communication",
      "Computer Applications",
      "Economics",
      "Business Law",
      "Taxation"
    ],
    popularity: 85,
    difficultyLevel: "easy"
  },
  {
    name: "Bachelor of Arts (English Literature)",
    code: "BA-ENG",
    degree: "bachelors",
    stream: "arts",
    duration: 3,
    description: "A 3-year program exploring English literature, language, writing, and critical thinking skills.",
    eligibility: {
      minimumEducation: "Class 12 with any stream",
      subjects: ["Any"],
      minimumPercentage: 50
    },
    careerOpportunities: {
      jobRoles: [
        "Content Writer",
        "Journalist",
        "Editor",
        "Teacher",
        "Translator",
        "Public Relations Officer",
        "Social Media Manager"
      ],
      averageSalary: {
        entry: 200000,
        mid: 400000,
        senior: 800000
      },
      industries: [
        "Media & Publishing",
        "Education",
        "Advertising",
        "Government",
        "NGOs",
        "Digital Marketing"
      ],
      governmentJobs: [
        "Civil Services",
        "Teaching Jobs",
        "Information Officer",
        "Translation Officer",
        "Cultural Officer"
      ],
      higherStudyOptions: [
        "MA English",
        "B.Ed (Teaching)",
        "Mass Communication",
        "Journalism",
        "Creative Writing"
      ]
    },
    skills: [
      "English Language",
      "Writing & Communication",
      "Critical Thinking",
      "Research Skills",
      "Public Speaking",
      "Creative Writing",
      "Literary Analysis"
    ],
    popularity: 70,
    difficultyLevel: "easy"
  }
]

export const sampleColleges = [
  {
    name: "Indian Institute of Technology Delhi",
    code: "IIT-D",
    type: "government",
    affiliation: "Institute of National Importance",
    location: {
      address: "Hauz Khas, New Delhi",
      city: "New Delhi",
      district: "South Delhi",
      state: "Delhi",
      pincode: "110016",
      coordinates: {
        latitude: 28.5449,
        longitude: 77.1928
      }
    },
    contact: {
      phone: ["+91-11-2659-1220"],
      email: ["admissions@iitd.ac.in"],
      website: "https://www.iitd.ac.in"
    },
    facilities: {
      hostel: true,
      library: true,
      labs: ["Computer Lab", "Physics Lab", "Chemistry Lab", "Engineering Labs"],
      sports: ["Cricket", "Football", "Basketball", "Swimming"],
      canteen: true,
      transport: true,
      wifi: true,
      medical: true
    },
    admissionInfo: {
      process: "JEE Advanced",
      cutoffs: [],
      fees: []
    },
    rankings: {
      nirf: 2,
      state: 1,
      category: 1
    },
    accreditation: {
      naac: {
        grade: "A++",
        score: 3.8,
        validUntil: new Date("2025-12-31")
      }
    },
    studentInfo: {
      totalSeats: 1000,
      reservationQuota: {
        general: 500,
        obc: 270,
        sc: 150,
        st: 75,
        ews: 100
      }
    },
    established: new Date("1961-01-01"),
    isActive: true
  },
  {
    name: "Delhi University - Sri Ram College of Commerce",
    code: "SRCC-DU",
    type: "government",
    affiliation: "University of Delhi",
    location: {
      address: "Maurice Nagar, New Delhi",
      city: "New Delhi",
      district: "North Delhi",
      state: "Delhi",
      pincode: "110007",
      coordinates: {
        latitude: 28.6692,
        longitude: 77.2348
      }
    },
    contact: {
      phone: ["+91-11-2766-7853"],
      email: ["principal@srcc.du.ac.in"],
      website: "https://www.srcc.du.ac.in"
    },
    facilities: {
      hostel: false,
      library: true,
      labs: ["Computer Lab", "Economics Lab"],
      sports: ["Cricket", "Basketball"],
      canteen: true,
      transport: false,
      wifi: true,
      medical: true
    },
    admissionInfo: {
      process: "CUET (Common University Entrance Test)",
      cutoffs: [],
      fees: []
    },
    rankings: {
      nirf: 3,
      state: 1,
      category: 1
    },
    accreditation: {
      naac: {
        grade: "A+",
        score: 3.6,
        validUntil: new Date("2026-03-31")
      }
    },
    studentInfo: {
      totalSeats: 500,
      reservationQuota: {
        general: 250,
        obc: 135,
        sc: 75,
        st: 40,
        ews: 50
      }
    },
    established: new Date("1926-01-01"),
    isActive: true
  },
  {
    name: "Jamia Millia Islamia",
    code: "JMI",
    type: "government",
    affiliation: "Central University",
    location: {
      address: "Jamia Nagar, New Delhi",
      city: "New Delhi",
      district: "South East Delhi",
      state: "Delhi",
      pincode: "110025",
      coordinates: {
        latitude: 28.5622,
        longitude: 77.2813
      }
    },
    contact: {
      phone: ["+91-11-2698-1717"],
      email: ["info@jmi.ac.in"],
      website: "https://www.jmi.ac.in"
    },
    facilities: {
      hostel: true,
      library: true,
      labs: ["Computer Lab", "Science Labs", "Language Lab"],
      sports: ["Cricket", "Football", "Hockey"],
      canteen: true,
      transport: true,
      wifi: true,
      medical: true
    },
    admissionInfo: {
      process: "JMI Entrance Test",
      cutoffs: [],
      fees: []
    },
    rankings: {
      nirf: 12,
      state: 3,
      category: 8
    },
    accreditation: {
      naac: {
        grade: "A",
        score: 3.2,
        validUntil: new Date("2025-06-30")
      }
    },
    studentInfo: {
      totalSeats: 800,
      reservationQuota: {
        general: 400,
        obc: 216,
        sc: 120,
        st: 60,
        ews: 80
      }
    },
    established: new Date("1920-01-01"),
    isActive: true
  }
]

export const aptitudeQuestions = [
  {
    id: "q1",
    type: "personality",
    category: "extraversion",
    question: "I enjoy meeting new people and socializing in large groups.",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" }
    ]
  },
  {
    id: "q2",
    type: "interest",
    category: "technical",
    question: "I enjoy solving complex mathematical problems and puzzles.",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" }
    ]
  },
  {
    id: "q3",
    type: "interest",
    category: "creative",
    question: "I prefer activities that involve creative expression and artistic work.",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" }
    ]
  },
  {
    id: "q4",
    type: "personality",
    category: "conscientiousness",
    question: "I am organized, punctual, and pay attention to details.",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" }
    ]
  },
  {
    id: "q5",
    type: "interest",
    category: "business",
    question: "I am interested in business, finance, and entrepreneurship.",
    options: [
      { value: 1, text: "Strongly Disagree" },
      { value: 2, text: "Disagree" },
      { value: 3, text: "Neutral" },
      { value: 4, text: "Agree" },
      { value: 5, text: "Strongly Agree" }
    ]
  }
]

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand",
  "Uttar Pradesh", "West Bengal", "Jammu and Kashmir", "Ladakh",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep", "Puducherry"
]
