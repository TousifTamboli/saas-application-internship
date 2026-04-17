# MediTrack Pro

A production-grade, full-stack healthcare equipment management web application. It provides a "Clinical Precision" dashboard to manage medical equipment, schedule maintenance, track service requests, and monitor staff and hospital resources in real-time.

## Features

- **Clinical Precision Design**: A beautiful, modern, dark-themed ("Obsidian") interface with tonal layering and glassmorphism, tailored for healthcare environments.
- **Equipment Inventory**: Manage all medical equipment, track status, location, and maintenance schedules.
- **Maintenance Tracking**: Log preventive and emergency maintenance, assigned technicians, and track maintenance costs.
- **Service Requests**: Allow staff to raise tickets for equipment issues based on priority levels.
- **Staff Directory**: Keep a roster of doctors, technicians, and specialized biomedical engineers along with their equipment assignments.
- **Reports & Analytics**: Visualization of equipment statuses, uptime rates, and monthly maintenance costs using modern, interactive charts.
- **Real-Time Alerts**: Receive immediate notifications for critical equipment issues and offline states.
- **Secure Authentication**: Protected routes with JWT-based authentication.

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3 with a custom design system palette
- **Components**: shadcn/ui & Radix UI primitives
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Server State**: TanStack Query (React Query v5)
- **Client State**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Data Visualization**: Recharts (Area, Donut, Bar, and Line charts)

### Backend
- **Framework**: Node.js & Express
- **Language**: TypeScript
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcrypt

## Project Structure

The project is structured entirely as a monorepo consisting of:
- `/backend`: The Express/MongoDB server providing stateless RESTful APIs.
- `/frontend`: The Vite/React application acting as the user interface.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (Running locally on default port 27017, or a MongoDB Atlas URI)

## Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd meditrack-pro
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```
   Ensure you have a `.env` file in the `backend` folder with the following variables:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/meditrack
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```
   Ensure you have a `.env` file in the `frontend` folder:
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   ```

## Seed the Database

To get up and running quickly with sample data (Equipment, Logs, Staff, Admin user, Alerts), run the backend seed script:

```bash
cd backend
npx ts-node src/utils/seedData.ts
```

This generates an admin account you can use:
- **Email:** `admin@meditrack.com`
- **Password:** `Admin@123`

## Running the Application

In two separate terminal windows, start the development servers:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be accessible at [http://localhost:5173/](http://localhost:5173/) and the API is hosted locally on [http://localhost:5001/api](http://localhost:5001/api).

## Available Scripts

### Backend (`/backend`)
- `npm run dev`: Starts the backend server in development mode using `ts-node-dev`.
- `npm run build`: Compiles the TypeScript backend into the `dist` folder.
- `npm run start`: Runs the compiled backend server from standard Node (`dist/index.js`).

### Frontend (`/frontend`)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles the React + TypeScript app to standard static assets in `dist`.
- `npm run preview`: Locally previews the production build.

## Roadmap

- [ ] Teleconsultancy WebRTC Integration.
- [ ] Push Notifications over WebSockets for Critical Alerts.
- [ ] Implement Advanced Equipment Utilization Analytics via Python Microservice.
- [ ] Deploy utilizing Docker and Kubernetes infrastructure.

---
*Developed for a modern, clinical precision healthcare architecture.*
