# GlideAway — Travel Booking System

GlideAway is a full-stack **Travel Booking System** developed as part of the **Rhombix Technologies Web Development Internship**.

The system provides users with a modern and responsive platform to explore destinations, search properties, view available rooms and deals, authenticate their accounts, and make travel reservations.

---

## ✈️ Project Overview

GlideAway was developed to fulfill the requirements of a Travel Booking System, including:

* User interface and wireframe-based design
* Structured database schema
* Backend server and reservation logic
* Responsive frontend
* User registration and authentication
* Search and filtering capabilities
* Destination and property exploration
* Room and deal management
* Booking and reservation functionality
* API-based backend communication
* Optional payment interface

---

## 🎯 Project Objectives

The main objectives of GlideAway are to:

* Provide an aesthetically pleasing and responsive travel booking interface.
* Allow users to explore destinations and travel properties.
* Provide detailed property and room information.
* Implement secure user registration and authentication.
* Enable users to search and filter available properties.
* Allow authenticated users to make reservations.
* Store users, destinations, properties, rooms, deals, and bookings in MongoDB.
* Establish a RESTful backend for handling application requests and business logic.

---

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* REST APIs

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## ✨ Features

### 🏠 Travel Landing Page

* Modern travel-focused homepage
* Responsive navigation
* Hero section
* Destination and travel content
* Deals section
* Call-to-action sections
* Responsive design for different screen sizes

### 🌍 Destinations

* Explore different travel destinations
* Destination-based property discovery
* Destination information stored in MongoDB

### 🏨 Properties

* Hotel, resort, villa, and apartment listings
* Property details
* Property images
* Location information
* Ratings and pricing information
* Property-based search and filtering

### 🛏️ Rooms

* Room information associated with properties
* Room types
* Pricing
* Capacity and availability-related information

### 🔎 Search & Filtering

Users can search and filter travel properties based on available information such as:

* Destination
* Property
* Price range
* Property type
* Rating

### 👤 User Registration & Authentication

* User registration
* Login
* JWT-based authentication
* Protected booking functionality
* Authenticated user access

### 📅 Booking & Reservation

Authenticated users can:

* Select a property
* View property details
* Select booking information
* Submit a reservation
* Store booking details in the database

### 🎁 Deals

* Dedicated travel deals section
* Promotional travel offers
* Destination-based deals
* Deal information managed through the backend

### 💳 Payment

A payment-related interface is included as part of the booking experience.

> **Note:** Payment gateway integration was an optional requirement of the project. GlideAway includes the payment/booking UI flow, but a real online payment gateway and payment-processing backend were not implemented.

---

## 🗄️ Database

GlideAway uses **MongoDB** with **Mongoose** for database management.

The database includes structured collections/models for:

* Users
* Destinations
* Properties
* Rooms
* Deals
* Bookings

Relationships between relevant entities are maintained using MongoDB references and Mongoose schemas.

---

## 🔌 Backend Architecture

The backend is built with **Node.js and Express.js** and provides RESTful APIs for communication between the frontend and database.

The backend handles:

* Authentication
* User management
* Destination data
* Property data
* Room data
* Deals
* Booking/reservation requests
* Database operations
* API request processing

---

## 📁 Project Structure

```text
GlideAway/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── glideaway-backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/alisha-tech21/RhombixTechnologies_Tasks.git
```

Navigate to the project:

```bash
cd RhombixTechnologies_Tasks/GlideAway
```

---

## 🔧 Backend Setup

Navigate to the backend:

```bash
cd glideaway-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and add the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

Or, if using a development script:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## 💻 Frontend Setup

Open another terminal and navigate to:

```bash
cd GlideAway/frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

Environment variables are not included in the repository for security reasons.

Create the required `.env` files locally and provide your own credentials/configuration.

Never commit:

```text
.env
.env.*
```

to GitHub.

---

## 📱 Responsive Design

GlideAway is designed to provide an adaptive user experience across:

* Desktop
* Laptop
* Tablet
* Mobile devices

The interface uses responsive layouts and CSS styling to adapt to different screen sizes.

---

## 📋 Requirements Implementation

| Requirement                 | Implementation               |
| --------------------------- | ---------------------------- |
| User Interface Design       | ✅ Implemented                |
| Wireframe / Layout Planning | ✅ Implemented                |
| Database Schema             | ✅ Implemented                |
| Backend Engineering         | ✅ Implemented                |
| Node.js / Express Server    | ✅ Implemented                |
| Frontend Development        | ✅ Implemented                |
| Responsive UI               | ✅ Implemented                |
| User Registration           | ✅ Implemented                |
| User Login                  | ✅ Implemented                |
| Authentication              | ✅ Implemented                |
| Search Functionality        | ✅ Implemented                |
| Reservation / Booking       | ✅ Implemented                |
| API Integration             | ✅ Implemented                |
| Payment Interface           | ✅ Implemented                |
| Real Payment Gateway        | ⚪ Optional / Not Implemented |

---

## 🔮 Future Improvements

Possible future enhancements include:

* Real payment gateway integration
* Online payment verification
* Booking cancellation and refund processing
* Email booking confirmations
* Advanced availability management
* User reviews and ratings
* Google Maps integration
* Advanced travel APIs
* Admin dashboard
* Booking history and management

---

## 👩‍💻 Developer

**Alisha Asmat**

GitHub: [@alisha-tech21](https://github.com/alisha-tech21)

---

## 📌 Internship Project

Developed as part of the **Web Development Internship at Rhombix Technologies**.

**Project:** GlideAway — Travel Booking System
