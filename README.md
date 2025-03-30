# Typing Test Application

A full-stack MERN application for measuring and analyzing typing performance. The application features a typing test with real-time feedback, performance tracking, and psychological insights based on typing patterns.

## Features

- **Core Typing Test**
  - Customizable test duration (15 or 30 seconds)
  - Different text types (words, numbers, mixed content)
  - Real-time error highlighting
  - WPM and accuracy tracking

- **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Protected routes

- **Performance Analytics**
  - Detailed session history
  - Performance trends over time
  - Best scores tracking

- **Advanced Analysis**
  - Error pattern analysis
  - Typing speed variations
  - Word-by-word timing analysis

- **Psychological Insights**
  - Impulsivity vs. deliberation analysis
  - Cognitive load assessment
  - Resilience measurement
  - Pressure response evaluation

## Tech Stack

- **Frontend**
  - React.js
  - Material-UI
  - Recharts for data visualization
  - Axios for API calls

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TechGeekRahul/typing-test-project.git
cd typing-test-project
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/typing-test
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/user` - Get user profile

### Typing Sessions
- `POST /api/sessions` - Create a new typing session
- `GET /api/sessions/:userId` - Get user's typing sessions
- `GET /api/sessions/stats/:userId` - Get user's statistics

### Analysis
- `GET /api/analysis/errors/:sessionId` - Get error analysis
- `GET /api/analysis/patterns/:sessionId` - Get typing patterns
- `GET /api/analysis/insights/:sessionId` - Get psychological insights

