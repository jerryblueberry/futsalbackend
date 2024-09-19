const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');

// Optimized function for faster Cloudinary upload
const uploadCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'user_profiles',
        transformation: [
          { width: 100, height: 100, crop: 'scale' },
          { quality: 'auto' ,fetch_format:'auto'}
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to a stream and pipe it to Cloudinary
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = uploadCloudinary;
