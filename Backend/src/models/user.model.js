import mongoose from "mongoose";
import bcrypt from 'bcrypt'


const userSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        contact:{
            type:String
        },
        password:{
            type:String,
            required:true
        },
        dob:{
            type:Date
            // required:true
        },
        profilePic:{
            type:String,
            default:""
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre('save',async function(){

    try {
        if(!this.isModified('password')) return;

        this.password=await bcrypt.hash(this.password,10)
        return;

    } catch (error) {
        throw error
    }

})


userSchema.method.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

const User=mongoose.model('User',userSchema)

export default User
