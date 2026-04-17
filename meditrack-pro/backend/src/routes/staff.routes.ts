import { Router } from 'express';
import { getAllStaff, getStaffById, createStaff, updateStaff, deleteStaff } from '../controllers/staff.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.route('/').get(getAllStaff).post(createStaff);
router.route('/:id').get(getStaffById).put(updateStaff).delete(deleteStaff);

export default router;
