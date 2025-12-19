# MERN Authentication Application

A full-stack MERN (MySQL, Express, React, Node.js) application with comprehensive authentication, role-based access control and user management features.

## Features

### Authentication
- User registration with email verification
- Secure login with JWT tokens
- Refresh token implementation
- Password reset via email
- Role-based access control (User/Admin)
- Google OAuth integration (optional)

### User Management
- User profile with edit functionality
- View all users with pagination
- Search users by name or email
- Admin can delete users
- Profile image upload with preview

### Technical Features
- MySQL database with Sequelize ORM
- Redis caching for improved performance
- JWT authentication with refresh tokens
- File upload with Multer
- Form validation with react-hook-form
- Responsive design with Tailwind CSS
- Express validation for API requests
- Lazy loading and optimization

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- Redis server
- npm or yarn

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mern-auth-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=mern_auth_db
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

REDIS_HOST=localhost
REDIS_PORT=6379

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourapp.com

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

Create MySQL database:
```sql
CREATE DATABASE mern_auth_db;
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ..  # Return to root directory
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Start Redis Server

```bash
redis-server
```

## Usage

1. Navigate to `http://localhost:5173`
2. Register a new account
3. Check your email for verification link
4. Verify your email
5. Login with your credentials
6. Access the dashboard to view users

### Admin Features

To make a user an admin, directly update the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

Admins can:
- Delete any user
- View all user details

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - Get all users (with pagination & search)
- `GET /api/users/:id` - Get user by ID
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile
- `DELETE /api/users/:id` - Delete user (admin only)

## Project Structure

```
mern-auth-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── multer.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── userController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── validation.ts
│   │   ├── models/
│   │   │   └── User.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── utils/
│   │   │   ├── email.ts
│   │   │   └── jwt.ts
│   │   └── server.ts
│   ├── uploads/
│   ├── .env
│   └── package.json
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Register.tsx
│   │   ├── Login.tsx
│   │   ├── VerifyEmail.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── Dashboard.tsx
│   │   ├── MyProfile.tsx
│   │   └── UserProfile.tsx
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
└── package.json
```

## Technologies Used

### Backend
- Node.js & Express
- TypeScript
- MySQL & Sequelize ORM
- Redis for caching
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Nodemailer for emails
- Express-validator for validation

### Frontend
- React 18 with TypeScript
- Vite
- React Router DOM
- Axios
- React Hook Form
- Tailwind CSS
- Context API for state management

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Refresh token rotation
- Email verification
- Protected routes
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Secure password reset flow
