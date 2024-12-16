import { Router } from 'express';

import { createRoom } from '../controllers/room.controller';
import { uploadimages } from '../middleware/room.images.upload';
import { isUserAuthenticated, isUserAdmin } from '../middleware/user.authentication';


const router = Router();

router.route('/create-room').post(isUserAuthenticated, isUserAdmin, uploadimages.array('roomImages',2), createRoom);

export { router as roomRouter };