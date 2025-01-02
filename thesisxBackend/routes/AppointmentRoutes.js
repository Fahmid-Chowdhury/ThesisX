import express from "express";
import { AcceptRequest, GetAppointment, GetRequestDetails, GetRequests, RejectRequest } from "../controllers/AppointmentController.js";
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/getappointments', checkAuth, GetAppointment);
router.get('/getrequests', checkAuth, GetRequests);
router.get('/request/getrequestdetails/:id', checkAuth, GetRequestDetails)
router.post('/request/accept/:id', checkAuth, AcceptRequest)
router.post('/request/reject/:id', checkAuth, RejectRequest)

export default router;
