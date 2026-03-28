import dotenv from "dotenv";

dotenv.config()


const ENV={
    MONGO_URL:process.env.MONGO_URL,
    PORT:process.env.PORT,
    NODE_ENV:process.env.NODE_ENV,
    jwtSecretKey:process.env.jwtSecretKey,
    EXPIRY:process.env.EXPIRY,
    RESEND_API_KEY:process.env.RESEND_API_KEY,  
    EMAIL_FROM_NAME:process.env.EMAIL_FROM_NAME,
    EMAIL_FROM_EMAIL:process.env.EMAIL_FROM_EMAIL,
    APP_NAME:process.env.APP_NAME,
    APP_LINK:process.env.APP_LINK,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET_KEY:process.env.CLOUDINARY_SECRET_KEY
    

}

export default ENV

