import express from "express";
import { login, logout, signup, check,updateProfilePic} from "../controller/user.controller.js";
import authentication from "../middleware/authMiddleWare.js";

const userRoutes=express.Router()

userRoutes.route('/signup').post(signup)
userRoutes.route('/logout').post(logout)
userRoutes.route('/login').post(login)
userRoutes.route('/check').get(authentication,check)
userRoutes.route('/updateProfilePic').post(authentication,updateProfilePic)


export default userRoutes 

