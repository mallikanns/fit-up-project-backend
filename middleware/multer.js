const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define the destination folder for uploaded images
const destinationFolder = path.join('public', 'images', 'Profile');

// Ensure the destination folder exists, or create it if it doesn't
if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder, { recursive: true }); // Creates the folder recursively if needed
}

// Define the multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('storage destination', req.body);
    cb(null, destinationFolder); // Set the destination folder for storing images
  },
  filename: (req, file, cb) => {
    console.log('storage', req.body);
    // Generate a unique filename based on user_username and file extension
    const user_username = req.body.user_username; // Assuming you have a user_username field in your request body
    const fileExtension = path.extname(file.originalname);
    const fileName = `username-${user_username}-imgProfile${fileExtension}`;
    cb(null, fileName);
  },
});

// Define the file filter function
const fileFilter = (req, file, cb) => {
  // Check file extensions
  console.log('fileFilter', file);
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.heif'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return cb(
      new Error('Wrong file type. Only PNG, JPG, or JPEG files are allowed.')
    );
  }

  // Check file size
  const maxFileSizeBytes = 2 * 1024 * 1024; // 2 megabytes (adjust as needed)
  if (file.size > maxFileSizeBytes) {
    return cb(new Error('File size exceeds the maximum allowed limit.'));
  }

  cb(null, true); // Pass the file
};

// Create the multer instance with the storage and file filter configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 megabytes (adjust as needed)
  },
});

module.exports = { upload };
