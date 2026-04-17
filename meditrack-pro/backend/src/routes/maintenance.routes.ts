import { Router } from 'express';
import {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from '../controllers/maintenance.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.route('/').get(getAllMaintenance).post(createMaintenance);
router.route('/:id').get(getMaintenanceById).put(updateMaintenance).delete(deleteMaintenance);

export default router;
