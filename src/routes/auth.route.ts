import express from 'express';
import { 
  registerUser,
  sendEmailVerificationLink,
  refreshAccessToken,
  verifyEmail,
  logoutUser,
  changePassword
 } from '../controllers/auth.controller';
import { isUserAuthenticated, isRefreshTokenValid } from '../middleware/user.authentication';
import upload from '../middleware/user.avtar.upload';
import { sendEmail } from '../utils/send.email';
const router = express.Router();


//test route

router.route('/register').post(upload.single('avtar'), registerUser);
router.route('/logout-user').post(isUserAuthenticated, logoutUser);
router.route('/change-password').post(isUserAuthenticated, changePassword);

router.route('/send-verification-email').post(isUserAuthenticated, sendEmailVerificationLink);
router.route('/verify-email/:token').post(isUserAuthenticated, verifyEmail);




router.route('/refresh-token').get(isRefreshTokenValid, refreshAccessToken);


export { router as authRouter };