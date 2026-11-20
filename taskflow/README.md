# TaskFlow — Full-Stack Task Management System

A production-grade full-stack task management application with JWT authentication, role-based access control, and a React frontend.

## 🏗️ Architecture
- **Backend:** Java 17 + Spring Boot 3.2 + Spring Security 6
- **Frontend:** React 18 + Vite + React Router v6
- **Database:** MongoDB 7
- **Auth:** JWT (HS256) + Role-Based Access Control

## 🚀 Quick Start
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- MongoDB: localhost:27017

## 👥 Default Roles
| Role | Access |
|------|--------|
| ADMIN | Full access — manage users, all tasks |
| MANAGER | Create/assign tasks, view all tasks in team |
| USER | View and manage own tasks only |

## 🧪 Run Tests
```bash
cd backend && mvn test
```