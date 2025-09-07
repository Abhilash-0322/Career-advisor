# Career Advisor - Digital Guidance Platform

## 🎯 Overview

Career Advisor is a comprehensive digital platform designed to guide students in choosing the right career path, degree courses, and government colleges. Built for the Smart India Hackathon 2024, this platform addresses the critical gap in career awareness among students in India.

## 🚀 Features

### Core Features Implemented

- **🧠 Aptitude & Interest Assessment**
  - Scientifically designed quizzes to assess student capabilities
  - Personality trait analysis
  - Interest mapping
  - Strength and weakness identification

- **📚 Course-to-Career Path Mapping**
  - Detailed visualization of career progression
  - Job market insights and salary projections
  - Industry-specific opportunities
  - Government job pathways

- **🏫 Government Colleges Directory**
  - Location-based college search
  - Admission requirements and cut-offs
  - Facilities and infrastructure information
  - Contact details and application processes

- **📅 Timeline Tracker**
  - Admission deadline notifications
  - Scholarship application reminders
  - Exam schedule alerts
  - Academic calendar integration

- **🎯 Personalized Recommendations**
  - AI-driven course suggestions
  - College matching based on profile
  - Success probability calculations
  - Alternative path recommendations

- **👨‍🏫 Expert Guidance**
  - Career counselor connectivity
  - Industry expert insights
  - Mentor network access
  - One-on-one consultation scheduling

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **State Management**: React Hooks
- **UI Components**: Custom component library with Lucide icons

## 📁 Project Structure

```
career-adv/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Layout components
│   │   └── sections/          # Page sections
│   ├── lib/                   # Utility libraries
│   ├── models/                # Database models
│   └── types/                 # TypeScript declarations
├── public/                    # Static assets
└── ...config files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-adv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/career-advisor
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checking

## 📊 Database Models

### User Model
- Personal information and preferences
- Education level and location
- Aptitude test results
- Preferred career streams

### Course Model
- Course details and eligibility
- Career opportunities and salary data
- Skills and learning outcomes
- Associated colleges

### College Model
- Government college information
- Location and contact details
- Facilities and infrastructure
- Admission processes and fees

### AptitudeResult Model
- Test responses and scores
- Personality analysis
- Recommendation engine output
- Performance tracking

## 🔐 Authentication

The platform uses NextAuth.js for secure authentication with:
- Email/password authentication
- JWT session management
- Protected API routes
- User profile management

## 🎨 UI/UX Design

- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Modern Interface**: Clean and intuitive design
- **Performance**: Optimized for fast loading

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Courses
- `GET /api/courses` - List courses with filters
- `POST /api/courses` - Create new course

### Colleges
- `GET /api/colleges` - List colleges with filters
- `POST /api/colleges` - Create new college

## 🌟 Future Enhancements

### Phase 2 Features
- **Mobile App Development**: React Native implementation
- **Advanced AI Integration**: GPT-powered career counseling
- **Real-time Chat**: Student-counselor communication
- **Video Consultations**: Virtual guidance sessions
- **Progress Tracking**: Academic milestone monitoring

### Phase 3 Features
- **Industry Partnerships**: Direct job placement
- **Skill Assessment**: Practical skill testing
- **Certification Integration**: Online course recommendations
- **Alumni Network**: Success story sharing

## 🏆 Impact Goals

- **50,000+ Students** guided annually
- **2,500+ Government Colleges** listed
- **100+ Career Paths** mapped
- **92% Success Rate** in career matching

## 👥 Team

This project was developed for the Smart India Hackathon 2024 as part of the Digital India initiative to improve educational guidance and career awareness among students.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📞 Support

For support and queries:
- Email: support@careeradvisor.gov.in
- Phone: 1800-XXX-XXXX (Toll Free)
- Documentation: [docs.careeradvisor.gov.in](https://docs.careeradvisor.gov.in)

---

**Built with ❤️ for Smart India Hackathon 2024**
