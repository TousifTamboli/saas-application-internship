import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import equipmentRoutes from './routes/equipment.routes';
import maintenanceRoutes from './routes/maintenance.routes';
import serviceRequestRoutes from './routes/serviceRequest.routes';
import staffRoutes from './routes/staff.routes';
import alertsRoutes from './routes/alerts.routes';
import { errorHandler, notFound } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MediTrack Pro API is running 🏥', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/alerts', alertsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🏥 MediTrack Pro Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

export default app;
