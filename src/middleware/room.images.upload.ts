import multer from 'multer';
import fs from 'fs';

const uploadDir = './uploads/room.images';

if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir)
}



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads/room.images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = 'room-image' + '-' + Date.now()
    cb(null, file.originalname.replace(file.originalname, uniqueSuffix))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype==='image/jpeg'){
      cb(null, true)
    }else{
      cb(null, false)
    }
  }
})

export { upload as uploadimages };