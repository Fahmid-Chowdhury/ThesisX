import express from "express";
import { GetAppointment, GetRequestDetails, GetRequests } from "../controllers/AppointmentController.js";
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/getappointments', checkAuth, GetAppointment);
router.get('/getrequests', checkAuth, GetRequests);
router.get('/request/getrequestdetails/:id', checkAuth, GetRequestDetails)

export default router;
