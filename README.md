# Frontend Developer Intern Assignment

This repository contains the **Frontend Developer Intern Assignment** submission. The project demonstrates a **scalable web application** with authentication, dashboard functionality, and CRUD operations, built using **TypeScript, React, TailwindCSS, Express, and PostgreSQL**.

---

## 🌐 Project Overview

The goal of this assignment is to build a modern, responsive, and secure web app with a basic backend for API requests. The app includes:

- User authentication (register/login/logout with JWT)  
- Protected dashboard with profile display  
- CRUD operations on a sample entity (`tasks`)  
- Search and filter functionality  
- Secure password handling and JWT-based route protection  

The frontend is the **primary focus**, with the backend acting as a supportive API layer.

---

## Tech Stack

**Frontend:**  
- React.js with TypeScript  
- TailwindCSS for responsive UI  
- React Router for navigation  
- Client-side validation (with HTML5 & custom checks)  

**Backend:**  
- Node.js with Express (TypeScript)  
- JWT-based authentication  
- Bcrypt for password hashing  
- PostgreSQL as database  

**Development Tools:**  
- Postman for API testing  
- Node.js & npm/pnpm for package management  

---

## ⚡ Features

### Frontend
- Fully responsive UI with **TailwindCSS**  
- Forms with client-side validation  
- Protected routes for dashboard access  
- Logout functionality  

### Backend
- User signup/login with **JWT authentication**  
- Password hashing with **bcrypt**  
- CRUD APIs for `tasks` entity  
- PostgreSQL database connection  
- Error handling and validation  

### Dashboard
- User profile display  
- Create, Read, Update, Delete tasks  
- Search and filter tasks  
- Secure logout flow  

---

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/BhaskarParab/assignment.git
```

### 2. Copy example env and update with your credentials
```bash
cd assignment
cd backend
npm install   # or pnpm install
cp .env.example .env
```
### 3. Start the server
```bash
npm run dev   # Start backend server (http://localhost:5000)
```
### 3. Database Setup, Make sure PostgreSQL is running.
### Create the database:
```bash
psql -U postgres
CREATE DATABASE assignment;
\q
```

### Run the initialization SQL to create tables:
```bash
psql -U postgres -d assignment -f ../database/init.sql
```

### configure your PostgreSQL connection in .env
```bash
npm run dev   # Start backend server
cd ../frontend
npm install   # or pnpm install
npm run dev   # Start frontend app (default: http://localhost:3000)
```

### 4. Frontend setup
```bash
cd ../frontend
npm install   # or pnpm install
npm run dev
```

## 📈 Scaling Notes
- Frontend is modular; adding new pages/components is simple
- Backend routes, controllers, and models are separated for easy scaling
- PostgreSQL can be migrated to cloud (AWS RDS, Supabase)
- JWT tokens can be refreshed for long sessions
- Redis caching can be added for high-performance dashboards
- Project can be containerized using Docker for production deployment

