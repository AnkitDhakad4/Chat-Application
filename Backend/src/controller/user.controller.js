import welcomeEmail from "../emails/emailHandler.js";
import User from "../models/user.model.js";
import { generateToken } from "../utils/webToken.js";
import ENV from "../ENV.js";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from '../Database/cloudinary.js'

const signup = async function (req, res) {
  try {
    // console.log(req.body)
    const { name, profilePic, password, dob, contact, email } = req.body;

    if ([name, email, password].some((ele) => !ele || ele.trim().length == 0)) {
      return res.status(400).json({
        message:
          "All field are required and do not send the spaced string only",
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

    const found = await User.findOne({ email: email });
    if (found) {
      return res.status(400).json({ message: "This email is already used" });
    }

    const user = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      profilePic,
      dob,
      contact,
    };
    const createdUser = await User.create(user);

    const findedUser = await User.findById(createdUser._id).select(
      "-password -dob",
    );

    

    if (!findedUser) {
      return res
        .status(500)
        .json({ message: "There is server error while logup" });
    } 

    const token = generateToken(findedUser._id);

    const isProduction = ENV.NODE_ENV === "production";
    const option = {
      secure: isProduction, 
      sameSite: isProduction ? "none" : "lax", // Crucial for cross-origin hosting like Render + Vercel
      httpOnly: true, 
    };

    return res
      .status(201)
      .cookie("accessToken", token, option)
      .json({ message: "User is created successfully", data: findedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async function (req, res) {
  try {
    const { email, password } = req.body;
    // console.log("Email and password in the login controller is ", req.body);

    if (
      !email || !password || [email, password].some((ele) =>
        ele?.trim().length == 0 ? true : false,
      )
    ) {
      return res
        .status(400)
        .json({ message: "Email & password must required to login" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Email is not registered yet want to register? " });
    }

    const matchPass = await user.matchPassword(password);

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.dob;

    if (!matchPass) {
      return res.status(400).json({ message: "Invlaid credentials" });
    }

    const token = generateToken(user._id);
    const isProduction = ENV.NODE_ENV === "production";
    const option = {
      secure: isProduction, 
      sameSite: isProduction ? "none" : "lax", // Crucial for cross-origin hosting like Render + Vercel
      httpOnly: true, 
    };

    return res
      .cookie("accessToken", token, option)
      .status(200)
      .json({ message: "User is logged in successfully ", data: userResponse });
  } catch (error) {
    // console.log("Error while login the user ", error.message);
    return res.status(500).json({
      message: "There is some error while login",
      error: error.message,
    });
  }
};

const logout = async function (req, res) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(400).json({ message: "User is not login" });
  }

  const isProduction = ENV.NODE_ENV === "production";
    const option = {
      secure: isProduction, 
      sameSite: isProduction ? "none" : "lax", // Crucial for cross-origin hosting like Render + Vercel
      httpOnly: true, 
    };

  try {
    const verification = jwt.verify(token, ENV.jwtSecretKey,{maxAge:'1h'});
    if (verification) {
      return res
        .clearCookie("accessToken", option)
        .json({ message: "User is logout successfully" });
    }
  } catch (error) {
    // console.log("Error while verifyin the JWT Token ", error.message);
    return res
      .status(401)
      .json({ message: "Token is not valid", error: error.message });
  }
};


const updateProfilePic=async function(req,res){
  try {
    const {url}=req.body
    
  
    if(!url) return res.status(400).json({messgae:"Profile pic not found "})
  
    const userId=req.user.id;

    
    const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:url},{new:true}).select("-password -dob")//this new returns the updated User
    
    return res.status(200).json({message:"Profile is updated successfully",data:updatedUser})
    
  } catch (error) {
    return res.status(500).json({message:"There is a error while updatin the profile of User"})
  }

}

const updateProfile=async function(req,res){
  try {
    const { name, profilePic, dob, contact,about } = req.body;
    const user=req.user

    
    
  

    const checkUser=await User.findById(user._id);
    if(!checkUser)
    {
      return res.status(400).json({message:"User not fold!!"})
    }
    // console.log("Before updating")
    const updatedProfile=await User.findOneAndUpdate({_id:user._id},{name,profilePic,dob,contact,about},{returnDocument:'after'}).select('-password')
  
    // console.log("updated profile is   ",updatedProfile)
    if(!updatedProfile)
    {
      return res.status(403).json({message:"Error while updaing the profile"})
    }
  
    return res.status(200).json({message:"Profile Updated Successfully",data:updatedProfile})
  } catch (error) {
    console.log(error)
      return res.status(500).json({message:"server error"})
  }

}
export { signup, login, logout,updateProfilePic,updateProfile };
