import mongoose from "mongoose";

const chatPartenersListSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    partners:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
},{timestamps:true})

chatPartenersListSchema.index({userId:1})

const chatParteners=mongoose.model('chatParteners',chatPartenersListSchema)

export default chatParteners