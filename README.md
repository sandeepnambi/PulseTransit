# PulseTransit - Tamil Nadu Public Transit Management System

A real-time public transit tracking and management system for Tamil Nadu, India. Built with the MERN stack, featuring live bus tracking, trip planning, emergency SOS integration, and fleet administration.

## 🚀 Features

### For Passengers
- **Live Map Tracking**: Real-time bus locations on an interactive map
- **Trip Planner**: Plan routes between any two bus stops with multiple options
- **Live Arrival Timeline**: View approaching buses with ETAs, occupancy, and status
- **Saved Routes**: Bookmark favorite routes for quick access
- **Emergency SOS**: One-tap emergency alert system with SMS integration (Twilio/Fast2SMS)
- **Multi-language Support**: English and Tamil language toggle
- **Agency Filter**: Filter buses by MTC Chennai, TNSTC, or SETC

### For Fleet Administrators
- **Fleet Operations Dashboard**: Real-time monitoring of all vehicles
- **Telemetry Ingestion**: Hardware GPS simulator for IoT device testing
- **Emergency Alert Management**: View and manage SOS dispatch history
- **Performance Metrics**: On-time percentage, speed compliance, occupancy tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Leaflet** for interactive maps
- **Framer Motion** for animations
- **Socket.io Client** for real-time updates
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Socket.io** for WebSocket connections
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Twilio API** for SMS alerts
- **Fast2SMS API** (alternative SMS gateway)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PulseTransit
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pulsetransit
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
FAST2SMS_API_KEY=your_fast2sms_api_key
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🗺️ Available Routes

### Frontend Routes
- `/` - Landing page (if not authenticated)
- `/app` - Main application (after login)
  - Live Map
  - Trip Planner
  - Saved Routes
  - Fleet Admin (admin only)
  - Hardware Tester (admin only)

### Backend API Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/buses` - Get all buses
- `GET /api/routes` - Get all routes
- `GET /api/stops` - Get all stops
- `POST /api/trip-planner` - Plan trip between stops
- `POST /api/sos/trigger` - Trigger emergency SOS
- `POST /api/telemetry/gps` - Ingest GPS telemetry data

## 👥 User Roles

### Passenger
- View live bus tracking
- Plan trips
- Save favorite routes
- Trigger emergency SOS

### Fleet Admin
- All passenger features
- Fleet operations dashboard
- Telemetry hardware testing
- Emergency alert management

## 📱 Supported Agencies

- **MTC Chennai** - Metropolitan Transport Corporation
- **TNSTC** - Tamil Nadu State Transport Corporation
- **SETC** - State Express Transport Corporation

## 🔐 Authentication

JWT-based authentication with role-based access control (RBAC). Users can register as passengers or fleet administrators.

## 🆘 Emergency SOS Integration

The SOS feature integrates with:
- **Twilio API** - Primary SMS gateway
- **Fast2SMS API** - Alternative SMS gateway for India

When triggered, alerts are sent to:
- Transport Control Room
- PCR Patrol Van
- Registered emergency contacts

## 🧪 Testing

### Hardware Telemetry Tester
Use the built-in hardware tester to simulate GPS data ingestion from IoT devices (ESP32/SIM800L modules).

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@pulsetransit.tn.gov.in or create an issue in the repository.

## 🙏 Acknowledgments

- Tamil Nadu State Transport Department
- OpenStreetMap for map tiles
- Leaflet for mapping library
- All open-source contributors
