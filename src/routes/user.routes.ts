import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { catchAsync } from '../utils/catchAsync';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole(['ADMIN']));

router.get('/', catchAsync(userController.getAll));
router.patch('/:id/role', catchAsync(userController.updateRole));

export default router;
