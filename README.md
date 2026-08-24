# GlobeTrotter

GlobeTrotter is a modern web application for planning trips, building custom itineraries, and exploring travel communities.

##  Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Styling**: Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: Zustand & React Query (@tanstack/react-query)
- **Forms & Validation**: React Hook Form & Zod
- **Icons & Charts**: Lucide React & Recharts
- **Animations**: Motion

### Backend
- **Framework**: Node.js with [Express.js](https://expressjs.com/)
- **Database & ORM**: PostgreSQL with [Prisma](https://www.prisma.io/)
- **Authentication**: JWT & bcrypt
- **Validation**: Zod
- **File Uploads**: Multer

##  Project Structure

The repository is organized into distinct frontend and backend directories:

- `/frontend` - Contains the Next.js client application
- `/backend` - Contains the Express.js REST API
- `/docs` - Additional project documentation

##  Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- PostgreSQL database

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables: Create a `.env` file in the `backend` directory and add your database connection string and JWT secret.
4. Set up the database and seed initial data:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables: Create a `.env.local` file with the necessary API endpoints.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:3000`.

##  Features
- **Trip Builder**: Interactive UI for planning days and adding activities.
- **Community**: Share itineraries and explore trips from other users.
- **Authentication**: Secure user login and registration.
- **Modern UI/UX**: Fully responsive and animated interfaces with light/dark themes.

##  License
ISC
