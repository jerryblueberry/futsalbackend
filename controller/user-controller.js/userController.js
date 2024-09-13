
const User = require('../../models/userModel');
const jwt  = require('jsonwebtoken')

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
            password
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
  
 
module.exports  = {Register,Login,refreshToken}