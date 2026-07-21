# Employee Leave Management System

A full-stack MERN application designed to simplify employee leave management with secure authentication, role-based access, department management, and leave approval workflows.

## Live Demo

**Live Application:**  
https://employee-leave-management-system-psi.vercel.app/

**GitHub Repository:**  
https://github.com/adityanarayan-1234/employee-leave-management-system

---

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

## Features

### Employee Module
- Secure Registration and Login
- JWT-Based Authentication
- Employee Dashboard
- Profile Management
- Apply for Leave
- View Leave History
- Leave Balance Tracking
- Logout Functionality

### Admin Module
- Admin Dashboard
- Employee Management
- Department Management
- Leave Request Approval & Rejection
- Leave Analytics Dashboard
- Activity Logs
- Employee Directory
- CSV Report Export

---

## Project Structure

```text
employee-leave-management/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── src/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── main.jsx
│
├── public/
├── package.json
└── vite.config.js
```

---

## Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/adityanarayan-1234/employee-leave-management-system.git
cd employee-leave-management
```

### Install Frontend Dependencies

```bash
npm install
npm run dev
```

### Install Backend Dependencies

```bash
cd server
npm install
```

---

## Running the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Authentication

- JWT-based Authentication
- Password Hashing using bcryptjs
- Protected Routes
- Role-Based Authorization (Admin & Employee)

---

## Future Enhancements

- Email Notifications
- Attendance Management
- Payroll Integration
- Calendar Integration
- Advanced Reports
- Mobile Responsiveness

---

## Author

**Aditya Narayan**

GitHub: https://github.com/adityanarayan-1234

---

## License

This project is intended for educational and portfolio purposes.