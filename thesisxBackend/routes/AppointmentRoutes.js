import express from "express";
import { GetAppointment, GetRequests } from "../controllers/AppointmentController.js";
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/getappointments', checkAuth, GetAppointment);
router.get('/getrequests', checkAuth, GetRequests);

export default router;
