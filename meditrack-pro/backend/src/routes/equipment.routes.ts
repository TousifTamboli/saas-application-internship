import { Router } from 'express';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  updateEquipmentStatus,
} from '../controllers/equipment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.route('/').get(getAllEquipment).post(createEquipment);
router.route('/:id').get(getEquipmentById).put(updateEquipment).delete(deleteEquipment);
router.patch('/:id/status', updateEquipmentStatus);

export default router;
