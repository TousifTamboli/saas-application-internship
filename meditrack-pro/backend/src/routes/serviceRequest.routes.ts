import { Router } from 'express';
import {
  getAllServiceRequests,
  getServiceRequestById,
  createServiceRequest,
  updateServiceRequest,
  updateServiceRequestStatus,
} from '../controllers/serviceRequest.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.route('/').get(getAllServiceRequests).post(createServiceRequest);
router.route('/:id').get(getServiceRequestById).put(updateServiceRequest);
router.patch('/:id/status', updateServiceRequestStatus);

export default router;
