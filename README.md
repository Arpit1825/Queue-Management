# 🚀 Smart Queue Management System

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express.js](https://img.shields.io/badge/Express.js-Framework-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)
![bcrypt](https://img.shields.io/badge/bcrypt-Security-orange)
![GitHub](https://img.shields.io/badge/GitHub-Version%20Control-lightgrey)

A modern full-stack Queue Management System designed to digitize customer flow in banks, hospitals, government offices, service centers, and public facilities.

The system replaces traditional manual queue handling with a smart token-based workflow, multi-counter management, queue tracking, analytics, and secure authentication.

---

# 📌 Problem Statement

Traditional queue systems face several challenges:

* Long waiting times
* Lack of queue visibility
* Manual token handling
* Poor customer experience
* No analytics or reporting
* Inefficient counter utilization

Customers often have no information about:

* Their queue position
* Current serving counter
* Service status
* Waiting progress

Organizations also struggle to monitor:

* Service performance
* Counter efficiency
* Customer traffic
* Operational bottlenecks

---

# 💡 Solution

Smart Queue Management System provides a digital queue platform that enables:

## Customers

* Generate digital queue tokens
* Track queue position
* Search token status
* Monitor queue progress

## Operators

* Serve next customer
* Complete service requests
* Manage counters
* Monitor active queues

## Management

* View operational analytics
* Monitor service metrics
* Analyze service distribution
* Track average service time

---

# 🎯 Problem → Solution Mapping

| Problem                                         | Solution Implemented                   |
| ----------------------------------------------- | -------------------------------------- |
| Customers don't know their queue position       | Token Search & Position Tracking       |
| Manual queue handling creates confusion         | Automated Token Generation             |
| Multiple counters are difficult to manage       | Multi-Counter Management System        |
| No visibility into service progress             | Waiting → Serving → Completed workflow |
| Customers repeatedly ask staff for updates      | Real-time Token Status Tracking        |
| Organizations lack operational insights         | Analytics Dashboard                    |
| No performance measurement                      | Average Service Time Tracking          |
| Difficult to monitor completed services         | Recent Completed Services Panel        |
| Traditional paper-token systems are inefficient | Digital Queue Management Platform      |

---

# ✨ Features

## 🎟 Smart Token Generation

Automatically generates sequential queue tokens.

Example:

Token #175

Token #176

Token #177

---

## 🏢 Multi-Counter Management

Supports multiple service counters simultaneously.

Example:

Counter 1 → Serving Token 171

Counter 2 → Serving Token 172

Counter 3 → Serving Token 173

Counter 4 → Available

---
## Real-Time Features

* Socket.io Integration
* Live Queue Updates
* Real-Time Dashboard Refresh
* Real-Time Counter Updates
  
## ⏳ Queue Lifecycle Management

Tracks customer journey through:

Waiting → Serving → Completed

---

## 🔍 Token Search System

Search any token instantly and view:

* Current Status
* Queue Position
* Service Type
* Assigned Counter

Example:

Status: Waiting

Position: 2

Counter: -

---

## 📊 Analytics Dashboard

Provides operational insights:

* Total Completed Tokens
* Total Waiting Tokens
* Total Serving Tokens
* Total Generated Tokens
* Average Service Time
* Service Distribution
* Recent Completed Services

---

## 📈 Service Distribution Analytics

Analyze customer traffic across service categories:

* General
* Billing
* VIP

---

## ⏱ Average Service Time Tracking

Measures actual service duration using:

Started Time → Completed Time

Helps organizations evaluate efficiency and optimize operations.

---

# 🌍 Real-World Applications

This system can be deployed in:

* Banks
* Hospitals
* Government Offices
* Universities
* Service Centers
* Public Help Desks
* Customer Support Centers
* Retail Service Counters

---

# 📈 Business Impact

The system helps organizations:

* Reduce customer waiting confusion
* Improve queue transparency
* Optimize counter utilization
* Track service performance
* Improve customer experience
* Collect operational insights through analytics

---

# 🛠 Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* EJS
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose

## Authentication & Security

* JWT Authentication
* bcrypt Password Hashing

## Version Control

* Git
* GitHub

---

# 📂 Project Structure

```bash
SmartQueue/
│
├── config/
│   └── development.json
│
├── models/
│   └── Queue.js
│
├── routes/
│   ├── queue.js
│   ├── users.js
│   └── index.js
│
├── public/
│   ├── css/
│   │   └── index.css
│   │
│   ├── js/
│   │   └── index.js
│   │
│   └── images/
│
├── views/
│   ├── dashboard.ejs
│   ├── queue.ejs
│   ├── analytics.ejs
│   ├── login.ejs
│   └── register.ejs
│
├── app.js
├── package.json
└── README.md
```

---

# 🗄 Database Schema

```javascript
{
  tokenNumber: Number,

  customerName: String,

  serviceType: String,

  status: {
    type: String,
    enum: [
      "waiting",
      "serving",
      "completed"
    ]
  },

  counterId: Number,

  startedAt: Date,

  servedAt: Date
}
```

---

# 🔄 System Workflow

### Step 1

Customer generates a token.

↓

### Step 2

Token enters waiting queue.

↓

### Step 3

Operator clicks "Serve Next".

↓

### Step 4

Token is assigned to an available counter.

↓

### Step 5

Service begins.

↓

### Step 6

Service is completed.

↓

### Step 7

Analytics update automatically.

---

# 🖥 Application Modules

## Dashboard

* Generate Token
* Serve Next Customer
* Complete Service
* Reset Queue
* View Waiting Queue
* Monitor Active Counters

## Queue Management

* Live Queue Monitoring
* Token Search
* Position Tracking
* Counter Status Tracking

## Analytics Dashboard

* Queue Statistics
* Service Metrics
* Recent Completed Services
* Average Service Time
* Service Distribution

---

# 📊 Available Metrics

The system currently tracks:

* Total Tokens Generated
* Waiting Customers
* Customers Being Served
* Completed Services
* Average Service Time
* Queue Position Tracking
* Service Type Distribution
* Recent Completed Services

---

# 🔐 Security Features

The application implements multiple security mechanisms:

* JWT Authentication
* bcrypt Password Hashing
* Protected Routes & Middleware
* Secure API Design
* Authentication-Based Access Control
* MongoDB Atlas Cloud Security
* Environment-Based Configuration

## Password Security

Passwords are never stored in plain text.

Before storing credentials, passwords are hashed using bcrypt:

```javascript
const hash = await bcrypt.hash(password, 10);
```

This ensures user credentials remain protected even if database data is exposed.

---

# 🚀 Future Enhancements

## Advanced Analytics

* Chart.js Visualizations
* Daily Reports
* Peak Hour Analysis
* Customer Traffic Insights

## Product Enhancements

* Digital Display Board
* QR-Based Token Generation
* SMS Notifications
* Email Notifications
* Role-Based Access Control

---

# 🎯 Learning Outcomes

This project provided hands-on experience with:

* REST API Development
* Express Routing
* MongoDB Atlas
* Mongoose ODM
* JWT Authentication
* bcrypt Security Implementation
* Database Design
* Queue Management Logic
* Analytics Design
* Full Stack Development
* Frontend-Backend Integration
* Debugging & Problem Solving
* Git & GitHub Workflow

---

# 👨‍💻 Team

## Rohan Verma

* Project Concept
* Repository Owner
* Initial UI Design

## Arpit Verma

* Full Stack Development
* Backend Architecture
* MongoDB Atlas Integration
* REST API Development
* Queue Management Logic
* Analytics Dashboard
* Token Search System
* Queue Position Tracking
* Service Time Analytics
* Authentication & Debugging

---

# ⭐ Support

If you found this project useful, consider giving it a star.

Built with ❤️ using Node.js, Express.js, MongoDB Atlas, JWT, bcrypt, and JavaScript.
