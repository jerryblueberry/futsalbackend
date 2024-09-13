
const User = require('../../models/userModel');
const jwt  = require('jsonwebtoken');
const uploadCloudinary = require('../../utils/uploadCloudinary');
const sharp = require('sharp');


//  Generate Token
const generateToken = (userId,secret,expiresIn) => {
    return  jwt.sign({userId},secret,{expiresIn});
};



const  Register = async(req,res) => {
    try {
        const {name,email,password}  = req.body;
        if(!name || !email || !password){
            return res.status(400).json({error:"All Fields are required"});
        }

        const addUser = new User({
            name,
            email,
            password,
            profileImage:null,
        })
        await addUser.save();
        res.status(200).json({success:true,message:"Added USer Successfully"});
    } catch (error) {
        console.error("Error While Registering user",error.message);
        res.status(500).json({error:error.message});
    }
} 

//  Login
const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const accessToken = generateToken(user._id, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
      const refreshToken = generateToken(user._id, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRES_IN);
      res.cookie('accessToken', accessToken, {
        httpOnly: true,

        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });
  
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
     
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });

      user.refreshToken = refreshToken;
      await user.save();
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  //Refresh Token  
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
      if (!refreshToken) return res.status(401).json({ error: 'No token provided' });
  
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) return res.status(403).json({ error: 'Invalid refresh token' });
  
      const newAccessToken = generateToken(user._id, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
      res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: 'Strict' });
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  // FOr adding user Iamge in the profile 
  const userImageUpload = async(req,res) => {
    try {
      const {userId} = req.params;
      if(!req.file){
        return res.status(400).json({error:"No File Uploaded"});
      }
      const file = req.file;
      const compressedBuffer = await sharp(file.buffer)
        .resize(600)
        .jpeg({ quality: 50 })
        .toBuffer();

      const result = await uploadCloudinary(compressedBuffer);
      const uploadImage =  await User.findByIdAndUpdate(userId,
        {profileImage:result.secure_url},
        {new:true,runValidators:true}
      )
      if(!uploadImage){
        return res.status(400).json({message:"User Not Found"});
      }

      res.status(200).json({
        message:"Image Uploaded Succesfully"

      })
    } catch (error) {
      res.status(500).json({error:error.message});
    }
  }


  //  For fetching LoggedInUser detail
  const fetchUserDetail = async(req,res) => {
    const {userId} = req.params;

    try {
      if(!userId){
        return res.status(400).json({message:"Credentials not available please login"});
      }  
      const user = await User.findById(userId).select('-password');
      if(!user){
        return res.status(401).json({message:"User not Found"});
      }
  
      res.status(200).json({user});
    } catch (error) {
      
    }
  }
 
module.exports  = {Register,Login,refreshToken,userImageUpload,fetchUserDetail}