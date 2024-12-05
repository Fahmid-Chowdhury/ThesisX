//============= imports =================
import express from 'express';
import AuthRoutes from './routes/AuthRoutes.js'
//=======================================
const app = express();
app.use(express.json());
app.use('/api/user', AuthRoutes);

export default app;