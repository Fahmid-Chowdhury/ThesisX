//============= imports =================
import express from 'express';
import cors from 'cors';
import AuthRoutes from './routes/AuthRoutes.js'
import UserRoutes from './routes/UserRoutes.js'
import PublicRoutes from './routes/PublicRoutes.js'
import FacultyRoutes from './routes/FacultyRoutes.js'
import AvailibilityRoutes from './routes/AvailableRoutes.js'
import DocumentRoutes from './routes/documentRoutes.js'
//=======================================
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/public', PublicRoutes);
app.use('/api/faculty', FacultyRoutes);
app.use('/api/availability', AvailibilityRoutes);
app.use("/api/document", DocumentRoutes);
export default app;