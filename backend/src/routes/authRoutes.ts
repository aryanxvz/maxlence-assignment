import express from 'express';
import {
  register,
  login,
  verifyEmail,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
} from '../controllers/authController';
import { upload } from '../config/multer';
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors,
} from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post(
  '/register',
  upload.single('profileImage'),
  validateRegistration,
  handleValidationErrors,
  register
);

router.get('/verify-email', verifyEmail);

router.post('/login', validateLogin, handleValidationErrors, login);

router.post('/refresh-token', refreshToken);

router.post(
  '/forgot-password',
  validateForgotPassword,
  handleValidationErrors,
  forgotPassword
);

router.post(
  '/reset-password',
  validateResetPassword,
  handleValidationErrors,
  resetPassword
);

router.post('/logout', authenticate, logout);

export default router;