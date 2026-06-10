import mongoose from 'mongoose';

const groupSchema=new mongoose.Schema({
    groupName:{
        type:String,
        required:true
    },
    groupIcon:{
        type:String
    },
    groupDescription:{
        type:String
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    members:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
},{timestamps:true})

const Group=mongoose.model('Group',groupSchema)

export default Group