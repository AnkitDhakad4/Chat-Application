import mongoose from "mongoose";

async function connection(){
    try {
        const response=await mongoose.connect(process.env.MONGO_URL)
    
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