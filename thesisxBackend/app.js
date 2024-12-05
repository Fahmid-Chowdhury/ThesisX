//============= imports =================
import express from 'express';
import cors from 'cors';
import AuthRoutes from './routes/AuthRoutes.js'
import UserRoutes from './routes/UserRoutes.js'
//=======================================
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);

export default app;