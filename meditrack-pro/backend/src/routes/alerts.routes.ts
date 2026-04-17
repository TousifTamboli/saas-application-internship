import { Router } from 'express';
import { getAllAlerts, createAlert, markAlertAsRead, deleteAlert, clearAllAlerts } from '../controllers/alerts.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.route('/').get(getAllAlerts).post(createAlert);
router.delete('/clear-all', clearAllAlerts);
router.patch('/:id/read', markAlertAsRead);
router.delete('/:id', deleteAlert);

export default router;
