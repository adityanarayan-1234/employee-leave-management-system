# Employee Leave Management System

## Overview

A full-stack MERN Employee Leave Management System that streamlines the leave approval process within an organization. Employees can apply for leave, track leave history, and manage their profiles, while administrators can manage employees, departments, approve or reject leave requests, monitor activities, and analyze leave statistics through an interactive dashboard.

The application focuses on secure authentication, efficient leave tracking, and an intuitive user interface to improve organizational workflow.

---

## Features

### Employee Module

* Secure User Registration and Login
* JWT-Based Authentication
* Employee Dashboard
* Employee Profile Management
* Apply for Leave
* View Leave History
* Leave Status Tracking
* Logout Functionality

### Admin Module

***Admin**
- Secure administrator authentication
- Interactive dashboard with leave analytics
- Approve or reject employee leave requests
- Automatic leave balance updates after approval or rejection
- Employee management (Add, View, Update and Delete)
- Department management
- Activity log for administrative actions
- Leave request monitoring and reporting

---
## Technology Stack

## Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)
- bcrypt.js

### Development Tools
- Git
- GitHub
- Visual Studio Code
- Postman

## Project Structure


Employee-Leave-Management-System
│
├── public
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
├── src
│   ├── assets
│   ├── components
│   ├── context
│   ├── layouts
│   ├── pages
│   ├── services
│   └── utils
│
├── package.json
├── vite.config.js
└── README.md
---

## Authentication

The application implements secure authentication using JSON Web Tokens (JWT).

Passwords are encrypted using bcrypt before being stored in the database, ensuring enhanced security.

---

## Dashboard Modules

### Employee Dashboard

* Personal Information
* Leave Application
* Leave History
* Leave Status

### Admin Dashboard

* Employee Management
* Department Management
* Activity Monitoring
* Leave Administration
* Dashboard Statistics

---

## Database

MongoDB is used as the primary database for storing:

* User Information
* Employee Records
* Leave Requests
* Department Data
* Activity Logs
bash
git clone :-https://github.com/adityanarayan-1234/employee-leave-management-system


### Install Frontend

bash

npm install
npm run dev


### Install Backend

bash
cd server
npm install
npm run dev


---

## Environment Variables

Create a .env file inside the server directory.

Example:


PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
## Future Enhancements

* Email Notifications
* Leave Approval Workflow
* Attendance Management
* Payroll Integration
* Report Generation
* Calendar Integration
* Role-Based Permissions
* Mobile Responsive Enhancements

---
## Security

- Passwords are securely hashed using bcrypt.js.
- JWT authentication protects private routes.
- Environment variables are stored in the server/.env file.
- Sensitive credentials are excluded from version control using .gitignore.

## Learning Outcomes

This project provided practical experience in:

* Building Full Stack MERN Applications
* REST API Development
* JWT Authentication
* MongoDB Database Design
* React Component Architecture
* CRUD Operations
* Secure User Authentication
* State Management
* Responsive UI Development

---

## Author

*Aditya Narayan*

GitHub: https://github.com/adityanarayan-1234

---

## License

This project is intended for educational and internship demonstration purposes.
