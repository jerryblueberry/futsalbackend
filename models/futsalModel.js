const mongoose = require('mongoose');
const futsalSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true,
    },
    price:{
        type:Number,
        required:true,
        index:true,

    },
    description:{
        type:String,
        maxLength:1200
    },
    address:{
        type:String,
        required:true,
        index:true
    }

    
})
futsalSchema.index({price:1});
futsalSchema.index({name:'text',address:'text'});


module.exports = mongoose.model('Futsal',futsalSchema);
//  Suggest filter with search for thatgiven address where we will add its coordinates manually and comparing that with the other futsal location we can provide radius based nearby for that selected area 
