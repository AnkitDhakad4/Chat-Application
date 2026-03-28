import mongoose from "mongoose";
import ENV from "../ENV.js";

async function connection(){
    try {
        const response=await mongoose.connect(ENV.MONGO_URL)
    
        if(response)
        {
            // console.log("mongoDB is connected successfully",response.connection.host)
        }
        return response
    } catch (error) {
        // console.log("Error while connectiong to the mongoDB:- ",error.message)
        throw error
    }
}

export default connection