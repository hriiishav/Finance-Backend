import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { catchAsync } from '../utils/catchAsync';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);
// Analysts and Admins can view dashboard
router.use(requireRole(['ANALYST', 'ADMIN']));

router.get('/summary', catchAsync(dashboardController.getSummary));

export default router;
