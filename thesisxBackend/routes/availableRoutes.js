import express from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { 
    getAvailability,
    addAvailability,
    updateAvailability
} from '../controllers/AvailabilityController.js';

const router = express.Router();

router.get('/get-availability', checkAuth, getAvailability);
router.put('/add-availability', checkAuth, addAvailability);
router.get('/update-availability', checkAuth, updateAvailability);

export default router;
