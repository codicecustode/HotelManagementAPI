import { Router } from 'express';

import { createRoom } from '../controllers/room.controller';
import { uploadimages } from '../middleware/room.images.upload';


const router = Router();

router.route('/create-room').post(uploadimages.array('roomImages',2), createRoom);

export { router as roomRouter };