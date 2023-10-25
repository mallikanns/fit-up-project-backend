const multer = require('multer');
const fs = require('fs');
const path = require('path');

const destinationFolder = path.join('public', 'images', 'Profile');

if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const user_username = req.body.user_username;
    const fileExtension = path.extname(file.originalname);
    const fileName = `username-${user_username}-imgProfile${fileExtension}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  console.log('fileFilter', file);
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.heif'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return cb(
      new Error('Wrong file type. Only PNG, JPG, or JPEG files are allowed.')
    );
  }

  const maxFileSizeBytes = 2 * 1024 * 1024;
  if (file.size > maxFileSizeBytes) {
    return cb(new Error('File size exceeds the maximum allowed limit.'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = { upload };
