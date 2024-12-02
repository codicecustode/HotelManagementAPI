import express from 'express';
import { registerUser } from '../controllers/auth.controller';
import upload from '../middleware/user.avtar.upload';
const router = express.Router();


router.post('/register',upload.single('avtar'), registerUser);


export { router as authRouter };