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
    }
})

userSchema.index({name:'text',email:'text'});

module.exports = mongoose.model('User',userSchema);