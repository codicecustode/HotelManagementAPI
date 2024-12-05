import express from 'express';
import { registerUser } from '../controllers/auth.controller';
import upload from '../middleware/user.avtar.upload';
import { sendEmail } from '../utils/send.email';
const router = express.Router();


//test route
router.post('/send-email', )

router.post('/register',upload.single('avtar'), registerUser);



export { router as authRouter };