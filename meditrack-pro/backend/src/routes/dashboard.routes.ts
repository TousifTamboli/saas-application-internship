import { Router } from 'express';
import { getDashboardStats, getUtilization, getMachinesByDepartment, getEnhancedStats } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.get('/stats', getDashboardStats);
router.get('/utilization', getUtilization);
router.get('/machines-by-department', getMachinesByDepartment);
router.get('/enhanced-stats', getEnhancedStats);

export default router;
