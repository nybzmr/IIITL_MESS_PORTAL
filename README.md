# IIITL Mess Portal

A full stack mess management platform built to digitize and streamline day to day mess operations for students and administrators at **Indian Institute of Information Technology, Lucknow (IIIT Lucknow)**.

The platform brings authentication, meal and coupon management, QR-based verification, online payments, automated notifications, administrative workflows and AI-assisted services into a single web application.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-3395FF)
![License](https://img.shields.io/badge/license-ISC-blue)

## Overview

IIITL Mess Portal replaces manual and fragmented mess workflows with a centralized digital system. Students can access mess services from a single interface, while authenticated administrators can manage operational data and services through protected APIs.

The application follows a full-stack architecture with a React single-page application, an Express/Node.js backend and MongoDB persistence. In production, the Node.js server also serves the compiled React frontend.

## Features

### Student Experience

- Google OAuth 2.0 authentication
- Student dashboard and personalized mess services
- Digital coupon and meal management
- QR-code generation and scanning for meal verification
- Online payments through Razorpay
- Automated coupon reminders
- Automatic coupon rollover
- AI-assisted functionality using Google Gemini

### Administration

- Protected administrator routes
- Centralized access to mess and application data
- Administrative management workflows
- Authentication-based separation of student and administrator access

### Backend & Automation

- REST-style Express API
- MongoDB persistence through Mongoose
- Session-based authentication with Passport.js
- MongoDB-backed sessions using `connect-mongo`
- Automated background schedulers for coupon reminders and rollover
- Email services using Nodemailer
- Compression and security middleware
- Content Security Policy and security headers through Helmet

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, React Router, Ant Design, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | Passport.js, Google OAuth 2.0, Express Session |
| Payments | Razorpay |
| AI | Google Gemini API |
| QR | `qrcode.react`, `@yudiel/react-qr-scanner` |
| HTTP | Axios |
| Email | Nodemailer |
| Security | Helmet, CORS |

## Architecture

```text
                         ┌─────────────────────────┐
                         │      React Frontend      │
                         │                         │
                         │ React Router            │
                         │ Ant Design              │
                         │ QR Scanner / Generator  │
                         │ Razorpay Integration    │
                         └────────────┬────────────┘
                                      │
                                HTTP / Session
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │    Express / Node.js    │
                         │                         │
                         │ /api/auth               │
                         │ /api/data               │
                         │ /api/admin              │
                         │ /api/user               │
                         │ /api/user/gemini        │
                         └──────────┬───────┬──────┘
                                    │       │
                         ┌──────────┘       └─────────────┐
                         ▼                                ▼
                ┌──────────────────┐          ┌────────────────────┐
                │ MongoDB /        │          │ External Services  │
                │ Mongoose         │          │                    │
                │                  │          │ Google OAuth       │
                │ Application data │          │ Gemini             │
                │ Session storage  │          │ Razorpay           │
                └──────────────────┘          │ Email              │
                                              └────────────────────┘
```

## Project Structure

```text
IIITL_MESS_PORTAL/
├── config/                 # Authentication and environment configuration
├── frontend/               # React client application
├── models/                 # Mongoose data models
├── routes/                 # Express API routes
├── services/               # Background jobs and application services
├── tools/                  # Utility and project tooling
├── index.js                # Backend application entry point
├── package.json            # Backend dependencies and scripts
├── package-lock.json       # Backend dependency lockfile
├── .gitignore
└── LICENSE
```

## API Structure

```text
/api/auth             Authentication and Google OAuth
/api/data             General application data
/api/admin            Protected administrator operations
/api/user             Protected authenticated-user operations
/api/user/gemini      Gemini-powered user functionality
```

The `/api/admin` namespace requires an authenticated user whose email matches the configured administrator account. The `/api/user` namespace requires an authenticated session.

## Prerequisites

Install the following before running the application locally:

- Node.js
- npm
- MongoDB or a MongoDB Atlas database
- Google OAuth 2.0 credentials
- Razorpay credentials for payment functionality
- Google Gemini API credentials for AI functionality
- Email credentials for notification functionality

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/nybzmr/IIITL_MESS_PORTAL.git
cd IIITL_MESS_PORTAL
```

### 2. Configure environment variables

The backend reads environment configuration from:

```text
config/config.env
```

Create the file locally. A typical configuration contains:

```env
PORT=4000
FRONTEND = http://localhost:3000
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:4000/api/auth/google/callback
SESSION_SECRET=your_secure_session_secret
GEMINI_API_KEY=your_gemini_api_key

PAY_ID=your_razorpay_key_id
PAY_SECRET=your_razorpay_key_secret

ADMIN=admin@example.com

```

Use the exact variable names expected by the corresponding configuration files in your deployment. Do not commit secrets or production credentials to the repository.

### 3. Install dependencies

From the repository root:

```bash
npm install
```

The root `postinstall` script installs the frontend dependencies and creates the production React build.

To install and build the frontend manually:

```bash
cd frontend
npm install
npm run build
cd ..
```

### 4. Run the application

```bash
npm start
```

The backend listens on port `4000` by default and serves the production React build.

Open:

```text
http://localhost:4000
```

## Development

Run the React development server:

```bash
cd frontend
npm start
```

Run the backend from the repository root:

```bash
npm start
```

## Scripts

### Root scripts

| Command | Purpose |
| --- | --- |
| `npm install` | Install backend dependencies and build the frontend through `postinstall` |
| `npm start` | Start the Express/Node.js server |
| `npm test` | Build the frontend and start the application |

### Frontend scripts

Run from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm start` | Start the React development server |
| `npm run build` | Generate the production frontend build |
| `npm test` | Run the React test suite |
| `npm run eject` | Eject Create React App configuration |

## Automated Services

The backend starts scheduled services after a successful MongoDB connection:

- **Coupon Reminder Scheduler** — handles automated coupon-related reminders.
- **Coupon Rollover Scheduler** — handles automated coupon rollover operations.

These services run alongside the Express server and use the application's database and email infrastructure where required.

## Security

The application includes several security mechanisms:

- Helmet security headers
- Content Security Policy configuration
- HTTP-only session cookies
- Secure cookies in production
- MongoDB-backed session storage
- Authentication middleware for protected API namespaces
- Administrator authorization based on configured credentials
- CORS configuration with credential support
- Environment-based secret management
- Response compression

For production deployments, use HTTPS, strong session secrets, restricted CORS origins and secure secret management.

## Dependency Maintenance

The project uses lockfiles for reproducible dependency installation:

- `package-lock.json` for the backend
- `frontend/package-lock.json` for the React application

The dependency baseline was refreshed recently maintenance cycle.
## License

This project is licensed under the **ISC License**. See [LICENSE](LICENSE) for the complete license text.

## Developer

**Nayaab Zameer**  
CSE undergrad at Indian Institute of Information Technology, Lucknow

[Repository](https://github.com/nybzmr/IIITL_MESS_PORTAL)
