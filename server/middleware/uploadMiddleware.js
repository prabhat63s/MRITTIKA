import multer from 'multer';

// Allowed file extensions
const allowedFileTypes = /jpeg|jpg|png|avif|webp/;

const fileFilter = (req, file, cb) => {
  const extname = allowedFileTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
  }
};

// Common multer config
const storage = multer.memoryStorage();

export const fileUpload = (fieldName, maxCount = 1, maxSizeMB = 5) => {
  const upload = multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 }, // MB to bytes
    fileFilter,
  });

  if (maxCount === 1) {
    return upload.single(fieldName); // single file
  } else {
    return upload.array(fieldName, maxCount); // multiple files
  }
};
