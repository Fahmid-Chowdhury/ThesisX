import express from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { 
    getAvailability,
    addAvailability,
    updateAvailability
} from '../controllers/availabilityController.js';

const router = express.Router();

router.get('/get-availability', checkAuth, getAvailability);
router.post('/add-availability', checkAuth, addAvailability);
router.get('/update-availability', checkAuth, updateAvailability);
router.get('/get-appointment')
router.get('/get-appointment/thesis')
router.post('/add-appointment')

export default router;
