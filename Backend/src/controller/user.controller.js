import welcomeEmail from "../emails/emailHandler.js";
import User from "../models/user.model.js";
import generateToken from "../utils/webToken.js";
import ENV from "../ENV.js";

const signup = async function (req, res) {
   try {
     
   const { name,profilePic,password,dob,contact,email } = req.body;
 

   if ([name, email, password].some((ele) => !ele || ele.trim().length == 0)) {
     return res.status(400).json({
       message: "All field are required and do not send the spaced string only",
     });
   }
 
   if (password.length < 8) {
     return res.status(400).json({
       message: "Password atleast have 8 characters",
     });
   }
 
   const emailRegex = /^\S+@\S+\.\S+$/;
   if (!emailRegex.test(email)) {
     return res.status(400).json({ message: "Invalid email format" });
   }
 
   
   const found=await User.findOne({email:email})
   if(found)
   {
     return res.status(400).json({message:"This email is already used"})
   }
 
   const user={
     name:name.trim(),
     email:email.trim().toLowerCase(),
     password,
     profilePic,
     dob,
     contact
   } 
   const createdUser=await User.create(user)
   
   const findedUser=await User.findById(createdUser._id).select('-password -dob')
   
  const data=await welcomeEmail(findedUser.email,findedUser.name,ENV.APP_LINK)
  console.log("After sending an email data is :",data)

   if(!findedUser)
   {
     return res.status(500).json({message:"There is server error while logup"})
   }
 
   const token=generateToken({id:findedUser._id})
 
   const option={
     secure:ENV.NODE_ENV=='development' ? false: true,
     samesite:"strict", //CSRF attack,
     httpOnly:true, //XSS attack:cross-site scriptting
 
 
   }

   
   return res.status(201)
   .cookie('accessToken',token,option)
   .json({message:'User is created successfully',data:findedUser})
     
   } catch (error) {
        return res.status(500).json({ message: error.message });
   }
};

export {signup}
