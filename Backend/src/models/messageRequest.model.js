import mongoose from 'mongoose';

const messageRequestSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status:{
        type:String,
        value:['pending','accepted','rejected'],
        default:'pending'

    }
},{timestamps:true})

messageRequestSchema.index({senderId:1,receiverId:1},{unique:true})
const MessageRequest=mongoose.model('MessageRequest',messageRequestSchema)