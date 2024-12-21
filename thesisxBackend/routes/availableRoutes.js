import express from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { 
    getAvailability,
    addAvailability,
    updateAvailability
} from '../controllers/availabilityController.js';

const router = express.Router();

// Get the logged-in faculty's availability
router.get('/get-availability', checkAuth, getAvailability);
// Update the logged-in faculty's availability
router.put('/add-availability', checkAuth, addAvailability);
// Get availability of all faculties (optional filters: department, tags)
router.get('/update-availability', checkAuth, updateAvailability);

export default router;
