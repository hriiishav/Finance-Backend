import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { initDb } from './config/database';
import { errorHandler } from './middlewares/error.middleware';
import apiRoutes from './routes';
import { setupSwagger } from './config/swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

setupSwagger(app);
app.use('/api', apiRoutes);

// Main Error Handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await initDb();
    console.log('Database initialized successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
