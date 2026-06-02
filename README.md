# Munch Time - Meal Planner App

A full-stack meal planning application built with React, Node.js, and MongoDB.

## Public URL
http://13.236.187.144

## JIRA Board
https://mariacurteanu01.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog?atlOrigin=eyJpIjoiMjdkOTliNDU1MGRjNDQ4Mzk1NDk1MDdkODlkM2NjMGQiLCJwIjoiaiJ9  

## Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Deployment: AWS EC2, Nginx, PM2
- CI/CD: GitHub Actions

## Project Setup Instructions

### Prerequisites
- Node.js v20+
- MongoDB Atlas account
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI and JWT secret to .env
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Test Credentials

### Regular User
- Email: test@test.com
- Password: password123

### Admin User
- Email: admin@test.com
- Password: admin123

## Features
- User registration and login
- Weekly meal plan with Breakfast/Lunch/Dinner grid
- Add, edit and delete meals
- Meal plan history
- Admin panel with user management
