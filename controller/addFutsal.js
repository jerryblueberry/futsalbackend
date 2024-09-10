const Futsal = require('../models/futsalModel');
const cloudinary = require('../config/cloudinaryConfig');
const getDataUri = require('../utils/dataUri');
const sharp = require('sharp');

// Helper function to upload to Cloudinary using stream
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'user_profiles', // Define the Cloudinary folder
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

    // Ensure all required fields are provided
    if (!name || !price || !address) {
      return res.status(400).json({ message: 'Required fields are missing!' });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No File Uploaded' });
    }
    const file = req.file;

    // Upload image to Cloudinary (directly from memory buffer)
    // const result = await uploadToCloudinary(req.file.buffer);
    // const fileUri = getDataUri(file);
    // const mycloud = await cloudinary.uploader.upload(fileUri.content)

    const compressedBuffer = await sharp(file.buffer)
      .resize(800)
      .toBuffer();
      const result = await uploadToCloudinary(compressedBuffer);

    // Create new futsal entry with Cloudinary image URL
    const newFutsal = new Futsal({
      name,
      price,
      description,
      address,
      futsalImage: result.secure_url,
    });

    // Save Futsal entry to MongoDB
    const savedFutsal = await newFutsal.save();

    // Send success response
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
