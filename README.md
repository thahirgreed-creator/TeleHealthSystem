# TeleHealth System

A comprehensive telehealth platform designed for rural healthcare delivery, connecting patients with healthcare providers through digital consultations and symptom reporting.

## Features

### For Patients
- **Symptom Reporting**: Voice and text-based symptom reporting with AI transcription
- **Virtual Consultations**: Video, audio, and chat consultations with doctors
- **Medical History**: Access to personal medical records and lab results
- **Health Alerts**: Receive important health notifications and outbreak alerts

### For Doctors
- **Patient Management**: Review patient reports and medical histories
- **Consultation Management**: Schedule and conduct virtual consultations
- **Outbreak Monitoring**: Monitor and respond to health outbreaks in the community
- **Lab Results**: Review and manage patient lab results

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Lucide React** for icons
- **date-fns** for date formatting

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd telehealth-system
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/telehealth
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   PORT=5000
   ```

   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update user profile

### Symptom Reports
- `POST /api/reports` - Create symptom report (patients only)
- `GET /api/reports` - Get all reports (doctors only)
- `GET /api/reports/patient/:patientId` - Get patient reports
- `GET /api/reports/:id` - Get single report
- `PATCH /api/reports/:id` - Update report (doctors only)

### Consultations
- `POST /api/consultations` - Create consultation
- `GET /api/consultations` - Get user consultations
- `GET /api/consultations/:id` - Get single consultation
- `PATCH /api/consultations/:id` - Update consultation
- `DELETE /api/consultations/:id` - Delete consultation

### Lab Results
- `POST /api/labresults` - Create lab result (doctors only)
- `GET /api/labresults` - Get lab results
- `GET /api/labresults/:id` - Get single lab result
- `PATCH /api/labresults/:id` - Update lab result (doctors only)

### Alerts
- `POST /api/alerts` - Create alert (doctors only)
- `GET /api/alerts` - Get alerts
- `GET /api/alerts/:id` - Get single alert
- `PATCH /api/alerts/:id/read` - Mark alert as read
- `PATCH /api/alerts/:id` - Update alert (doctors only)

## User Roles

### Patient
- Report symptoms via voice or text
- Schedule and attend consultations
- View medical history and lab results
- Receive health alerts and notifications

### Doctor
- Review patient symptom reports
- Conduct virtual consultations
- Manage patient records
- Create and manage health alerts
- Monitor outbreak patterns

## Development

### Project Structure
```
telehealth-system/
├── src/
│   ├── components/          # React components
│   │   ├── Auth/           # Authentication components
│   │   ├── Doctor/         # Doctor-specific components
│   │   ├── Patient/        # Patient-specific components
│   │   └── Layout/         # Layout components
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   └── config/             # Configuration files
├── server/
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── server.js           # Server entry point
└── public/                 # Static assets
```

### Key Features Implementation

1. **Authentication**: JWT-based authentication with role-based access control
2. **Real-time Communication**: Prepared for WebRTC integration for video calls
3. **Voice Recording**: Browser-based audio recording for symptom reporting
4. **Responsive Design**: Mobile-first design with Tailwind CSS
5. **Error Handling**: Comprehensive error handling and user feedback
6. **Data Validation**: Input validation on both client and server sides

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.