
const multer = require('multer');


const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single('futsalImage');
const profileUpload = multer({storage}).single('profileImage');


module.exports = {singleUpload,profileUpload};
