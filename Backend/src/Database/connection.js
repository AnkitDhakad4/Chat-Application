import mongoose from "mongoose";
import ENV from "../ENV.js";

// new to to connect with mongoDB
import dns from 'node:dns';
dns.setServers([
    '8.8.8.8',
    '8.8.4.4'
])


async function connection(){
    try {
        
        const response=await mongoose.connect(ENV.MONGO_URL)
        
        if(response)
        {
            // console.log("mongoDB is connected successfully",response.connection.host)
        }
        return response
    } catch (error) {
        console.log("Error while connectiong to the mongoDB:- ",error)
        throw error
    }
}

export default connection