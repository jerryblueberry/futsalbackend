const cloudinary = require('../config/cloudinaryConfig');


const uploadCloudinary  = (buffer) => {
    return new Promise((resolve,reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder:'user_profiles',
                transformation:[
                    {width:600,crop:'scale'},
                    {quality:'auto'}
                ],
            },
            (error,result) => {
                if(error){
                    reject(error)
                }else{
                    resolve(result)
                }
            }
        )
        stream.end(buffer);
    })
}

module.exports = uploadCloudinary;