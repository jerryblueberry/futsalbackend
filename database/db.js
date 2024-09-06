
const mongoose = require('mongoose');
const CONNECTION = 'mongodb+srv://sajan2121089:sajank1818@cluster0.tvehb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const connectDb = async () => {
  try {
    await mongoose.connect(CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);  // Exit if the database connection fails
  }
};

module.exports = connectDb;

