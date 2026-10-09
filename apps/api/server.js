import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import internshipsRoutes from './routes/internships.js';
import companiesRoutes from './routes/companies.js';
import filtersRoutes from './routes/filters.js';
import bookmarksRoutes from './routes/bookmarks.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

// Background Scheduler
import { startScheduler } from './services/scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv from ../../.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

// Apply middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());

// Mount route files
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/filters', filtersRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/admin', adminRoutes);

// Health checks
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Global error handler middleware
app.use(errorHandler);

const PORT = process.env.API_PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startScheduler();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[API Server] Port ${PORT} is already in use by another process.`);
    console.error(`Run 'npm run clean:ports' to kill existing instances.`);
    process.exit(1);
  } else {
    console.error('[API Server] Unexpected server error:', err);
  }
});

process.on('uncaughtException', (err) => {
  console.error('[API Server] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[API Server] Unhandled Rejection:', reason);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
