import express from 'express';
import {
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  deleteUser,
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../config/multer';
import { validateUpdateProfile, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

router.get('/users', authenticate, getUsers);

router.get('/users/:id', authenticate, getUserById);

router.get('/profile', authenticate, getProfile);

router.put(
  '/profile',
  authenticate,
  upload.single('profileImage'),
  validateUpdateProfile,
  handleValidationErrors,
  updateProfile
);

router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);

export default router;