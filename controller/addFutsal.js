const Futsal = require('../models/futsalModel');
const cloudinary = require('../config/cloudinaryConfig');
const getDataUri = require('../utils/dataUri');
const sharp = require('sharp');

// Helper function to upload to Cloudinary using stream
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'user_profiles',
        transformation: [
          { width: 800, crop: "scale" },  // Resize to 800px width
          { quality: "auto" },            // Automatically adjust quality

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

    // Write the buffer directly to Cloudinary's stream
    stream.end(buffer);
  });
};

const addFutsal = async (req, res) => {
  try {
    const { name, price, address, description } = req.body;

    if (!name || !price || !address) {
      return res.status(400).json({ message: 'Required fields are missing!' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No File Uploaded' });
    }

    const file = req.file;

    console.time("Image Processing");
    const compressedBuffer = await sharp(file.buffer)
      .resize(800) // Resize the image to a max width of 800px
      .jpeg({ quality: 50 }) 
      .toBuffer();
    console.timeEnd("Image Processing");

    console.time("Cloudinary Upload");
    const result = await uploadToCloudinary(compressedBuffer);
    console.timeEnd("Cloudinary Upload");

    const newFutsal = new Futsal({
      name,
      price,
      description,
      address,
      futsalImage: result.secure_url,
    });

    const savedFutsal = await newFutsal.save();
    res.status(200).json({ savedFutsal });
  } catch (error) {
    console.error('Error While Adding Futsal:', error);
    res.status(500).json({ error: error.message });
  }
};


const getAllFutsals = async (req, res) => {
  try {
  
    const futsals = await Futsal.find();
    res.status(200).json({ futsals });
  } catch (error) {
    console.error('Error While Getting Futsal:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addFutsal, getAllFutsals };
