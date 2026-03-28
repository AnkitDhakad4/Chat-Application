import {v2 as cloudinary} from "cloudinary"
import ENV from "../ENV.js"

cloudinary.config({
    cloud_name:ENV.CLOUDINARY_CLOUD_NAME,
    api_key:ENV.CLOUDINARY_API_KEY,
    api_secret:ENV.CLOUDINARY_SECRET_KEY
})



const uploadOnCloudinary=async function(profilePic,folderName){
    try {
        const response=await cloudinary.uploader.upload(profilePic,{
            folder:folderName
        })

        if(!response)
        {
            const error=new Error("Error while uploading on the cloudinary")
            error.status=500
            throw error
        }

        return response.secure_url
    } catch (error) {
        throw error
    }
}

export default uploadOnCloudinary