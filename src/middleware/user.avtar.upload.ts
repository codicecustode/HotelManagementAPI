import multer from 'multer';
import fs from 'fs';

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req: Express.Request, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(file.originalname, 'img' + Date.now()));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3000000 },
  fileFilter: (req : Express.Request, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg and .png format allowed!'));
    }
  }}
);

export default upload;