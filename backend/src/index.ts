import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import authRoutes from './routes/auth.routes';
import tripRoutes from './routes/trip.routes';
import stopRoutes from './routes/stop.routes';
import stopActivityRoutes from './routes/stopActivity.routes';
import cityRoutes from './routes/city.routes';
import activityRoutes from './routes/activity.routes';
import userRoutes from './routes/user.routes';
import communityRoutes from './routes/community.routes';
import publicRoutes from './routes/public.routes';
import adminRoutes from './routes/admin.routes';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/stop-activities', stopActivityRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
