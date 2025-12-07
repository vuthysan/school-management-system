# 🎓 Cambodia School Management System (SMS)

> **Digitizing Education Management for Cambodia**  
> Transforming Cambodia's education sector from paper-based to digital-first administration

[![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue.svg)](https://github.com/weteka/sms)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-in%20development-yellow.svg)](https://github.com/weteka/sms)

---

## 🌟 Vision & Mission

### Vision
To become Cambodia's leading school management platform, empowering educational institutions with modern digital tools while paving the way for nationwide digital transformation in education.

### Mission
**Digitizing Cambodia's Education System, One School at a Time** - We are building a comprehensive school management platform that replaces traditional paper-based processes with a secure, scalable, and user-friendly digital solution.

#### Our Approach
🏫 **Phase 1: Private Schools** (Current)  
Starting with private schools and international institutions to prove our platform's value, gather feedback, and refine our solution in real-world environments.

🏛️ **Phase 2: National Scale** (Future)  
Expanding to support the Ministry of Education, Youth and Sport (MoEYS) with a proven, battle-tested platform for nationwide educational data management.

#### Our Goals
- 🚀 **Modernize Operations**: Eliminate paper-based workflows and manual record-keeping
- � **Reduce Costs**: Help schools save time and resources through automation
- 📊 **Enable Data Insights**: Provide actionable analytics for better decision-making
- 🔒 **Ensure Security**: Protect sensitive student and institutional data
- 🌐 **Improve Accessibility**: Make educational data accessible anytime, anywhere
- 🇰🇭 **Support Cambodia**: Build local capacity and contribute to educational excellence

---

## 🎯 Key Features

### For School Administrators & Owners
- **Complete School Management**: All-in-one platform to run your school efficiently
- **Student Management**: Digital student records, enrollment, and tracking
- **Staff Management**: Teacher and staff administration with payroll integration
- **Academic Management**: Class scheduling, subject allocation, and curriculum tracking
- **Attendance Tracking**: Real-time attendance monitoring for students and staff
- **Grade Management**: Digital gradebooks and academic performance tracking
- **Financial Management**: Fee collection, invoicing, and financial reporting
- **Multi-Branch Support**: Manage multiple campuses from a single dashboard
- **Analytics & Reports**: Data-driven insights for better decision-making

### For Teachers
- **Class Management**: Easy access to class rosters and schedules
- **Attendance Recording**: Quick and efficient attendance marking
- **Grade Entry**: Streamlined grade submission and reporting
- **Student Progress**: Track individual student performance
- **Communication**: Direct messaging with parents and students

### For Parents & Students
- **Academic Records**: Access to grades, attendance, and progress reports
- **Real-time Updates**: Instant notifications about school activities
- **Fee Management**: View and track payment history
- **Announcements**: Stay informed about important updates

### For Ministry of Education (Future)
- **National Dashboard**: Real-time overview of all participating schools
- **Data Analytics**: Comprehensive reporting and insights for policy decisions
- **Resource Planning**: Track and allocate educational resources efficiently
- **Standards Compliance**: Ensure schools meet national educational standards

---

## 🏗️ System Architecture

### Technology Stack

#### Backend (Server)
- **Language**: Rust 🦀
- **Framework**: Actix-web
- **API**: GraphQL (async-graphql)
- **Database**: MongoDB
- **Authentication**: Koompi OAuth 2.0

#### Frontend (Dashboard)
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + GraphQL Client
- **UI Components**: Custom component library

### Architecture Pattern
```
┌─────────────────┐
│   Dashboard     │  Next.js Frontend
│   (Next.js)     │
└────────┬────────┘
         │
         │ GraphQL API
         │
┌────────▼────────┐
│   API Server    │  Rust Backend
│   (Actix-web)   │
└────────┬────────┘
         │
         │ MongoDB Driver
         │
┌────────▼────────┐
│    MongoDB      │  Database
│   (Document DB) │
└─────────────────┘
```

---

## 📦 Core Modules

### 1. **School Management**
- Multi-branch school support
- School profiles and settings
- Branch management

### 2. **Student Management**
- Student enrollment and records
- Student profiles with photos
- Transfer and graduation tracking

### 3. **Academic Management**
- Class creation and management
- Subject allocation
- Curriculum tracking
- Academic year management

### 4. **Attendance System**
- Daily attendance tracking
- Attendance reports and analytics
- Absence notifications

### 5. **Grade Management**
- Digital gradebooks
- Grade entry and calculation
- Report card generation
- Academic performance analytics

### 6. **Staff & HR Management**
- Teacher and staff profiles
- Payroll management
- Leave management
- Performance tracking

### 7. **Financial Management**
- Fee structure management
- Payment collection
- Invoice generation
- Financial reporting

### 8. **User Management**
- Role-based access control (RBAC)
- Koompi OAuth integration
- Multi-level permissions
- Audit logging

---

## 🚀 Getting Started

### Prerequisites
- **Rust** 1.70+ (for backend)
- **Node.js** 18+ (for frontend)
- **MongoDB** 6.0+ (database)
- **Koompi Account** (for authentication)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/weteka/sms.weteka.com.git
cd sms.weteka.com
```

#### 2. Setup Backend (Server)
```bash
cd server

# Copy environment variables
cp .env.example .env

# Configure your .env file with:
# - MONGODB_URI
# - MONGODB_NAME
# - KOOMPI_CLIENT_ID
# - KOOMPI_CLIENT_SECRET
# - JWT_SECRET

# Run the server
cargo run
```

The server will start on `http://localhost:8081`  
GraphQL Playground: `http://localhost:8081/graphql`

#### 3. Setup Frontend (Dashboard)
```bash
cd dashboard

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your .env.local file

# Run the development server
npm run dev
```

The dashboard will start on `http://localhost:3000`

---

## 📚 Documentation

- [API Documentation](docs/API.md) - GraphQL API reference
- [Database Schema](docs/SCHEMA.md) - MongoDB collections and models
- [Authentication Guide](docs/AUTH.md) - Koompi OAuth integration
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- [Contributing Guide](CONTRIBUTING.md) - How to contribute to the project

---

## 🗺️ Roadmap

### Phase 1: Private School Launch (Q1 2025 - Current)
- [x] Core backend architecture (Rust + GraphQL)
- [x] MongoDB database design
- [x] Koompi OAuth authentication
- [x] Student, Class, Subject modules
- [x] Attendance and Grade modules
- [ ] Modern dashboard UI
- [ ] User management and RBAC
- [ ] **First Private School Pilot** 🎯

### Phase 2: Market Expansion (Q2 2025)
- [ ] Financial management module (fees, invoicing, payments)
- [ ] HR and payroll system
- [ ] Advanced reporting and analytics
- [ ] Parent/Student portal
- [ ] Mobile application (iOS/Android)
- [ ] Multi-language support (Khmer, English)
- [ ] **Onboard 10+ Private Schools** 🎯

### Phase 3: Feature Enhancement (Q3 2025)
- [ ] SMS/Email notifications
- [ ] Document management system
- [ ] Advanced analytics dashboard
- [ ] Library management
- [ ] Transportation management
- [ ] Hostel/Dormitory management
- [ ] **Reach 50+ Schools** 🎯

### Phase 4: National Scale (Q4 2025 - 2026)
- [ ] MoEYS integration and compliance
- [ ] National education database connectivity
- [ ] Government reporting standards
- [ ] AI-powered insights and predictions
- [ ] Advanced security and audit features
- [ ] **Partner with MoEYS for Nationwide Rollout** 🎯

---

## 🤝 Contributing

We welcome contributions from developers, educators, and education technology enthusiasts! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Weteka** - Building digital solutions for Cambodia's education sector

- Website: [https://weteka.com](https://weteka.com)
- Email: contact@weteka.com

---

## 🙏 Acknowledgments

- **Ministry of Education, Youth and Sport (MoEYS)** - For supporting digital transformation in education
- **Koompi** - For providing authentication infrastructure
- **Open Source Community** - For the amazing tools and libraries that make this possible

---

## 📞 Support

For support, please contact:
- **Technical Issues**: support@weteka.com
- **General Inquiries**: info@weteka.com

---

<div align="center">
  <strong>Built with ❤️ for Cambodia's Education Future</strong>
</div>
