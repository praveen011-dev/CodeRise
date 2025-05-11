import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, `./public/images`);
  },
  filename: function (_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Middleware responsible to read form data and upload the File object to the mentioned path
export const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1000 * 1000,
  },
});
