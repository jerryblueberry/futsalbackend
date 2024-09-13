const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    },
    profileImage:{
        type:String
    }
    //  profile Image doesn't need to be required 
    // Initial Register Includes Avatar with user Name front letter
    // Later they can add photo from their profile section
    //  To save register time 
})

userSchema.index({name:'text',email:'text'});

module.exports = mongoose.model('User',userSchema);