import express from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { 
    getAvailability, 
    updateAvailability, 
    getAllFacultiesAvailability 
} from '../controllers/availabilityController.js';

const router = express.Router();

// Get the logged-in faculty's availability
router.get('/get-availability', checkAuth, getAvailability);
// Update the logged-in faculty's availability
router.put('/update-availability', checkAuth, updateAvailability);
// Get availability of all faculties (optional filters: department, tags)
router.get('/get-all-faculties-availability', checkAuth, getAllFacultiesAvailability);

export default router;
