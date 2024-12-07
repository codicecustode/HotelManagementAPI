import express from 'express';
import { 
  registerUser,
  sendEmailVerificationLink,
  refreshAccessToken
 } from '../controllers/auth.controller';
import { isUserAuthenticated, isRefreshTokenValid } from '../middleware/user.authentication';
import upload from '../middleware/user.avtar.upload';
import { sendEmail } from '../utils/send.email';
const router = express.Router();


//test route
router.post('/send-email', )

router.post('/register',upload.single('avtar'), registerUser);
router.post('/send-verification-email', isUserAuthenticated, sendEmailVerificationLink)




router.route('/refresh-token').get(isRefreshTokenValid, refreshAccessToken);


export { router as authRouter };