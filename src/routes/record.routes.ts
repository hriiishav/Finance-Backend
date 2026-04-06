import { Router } from 'express';
import { recordController } from '../controllers/record.controller';
import { catchAsync } from '../utils/catchAsync';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

// Viewers, Analysts, and Admins can view
router.get('/', catchAsync(recordController.getAll));
router.get('/:id', catchAsync(recordController.getById));

// Only Admins can create/update/delete
router.use(requireRole(['ADMIN']));
router.post('/', catchAsync(recordController.create));
router.patch('/:id', catchAsync(recordController.update));
router.delete('/:id', catchAsync(recordController.delete));

export default router;
