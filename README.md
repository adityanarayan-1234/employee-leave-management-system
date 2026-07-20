# Employee Leave Management System

## Overview

The Employee Leave Management System is a full-stack web application developed to simplify and streamline the leave management process within an organization. It enables employees to submit leave requests, monitor their leave history, and manage their profiles, while providing administrators with a centralized dashboard to manage employees, departments, and leave approvals.

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

* Admin Dashboard
* Employee Management
* Add New Employees
* Update Employee Information
* Delete Employee Records
* Department Management
* View Employee Details
* Monitor Leave Requests
* Activity Logs
* Dashboard Analytics

---
## Technology Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Tailwind CSS
* Axios
* Recharts

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt.js

### Development Tools

* Visual Studio Code
* Git
* GitHub

## Project Structure


Employee-Leave-Management-System
│
├── client
│   ├── src
│   ├── assets
│   ├── components
│   ├── context
│   ├── pages
│   └── services
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
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
cd client
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
