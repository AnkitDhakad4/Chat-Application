import express from "express";
import { login, logout, signup, check} from "../controller/user.controller.js";
import authentication from "../middleware/authMiddleWare.js";

const userRoutes=express.Router()

userRoutes.route('/signup').post(signup)
userRoutes.route('/logout').post(logout)
userRoutes.route('/login').post(login)
userRoutes.route('/check').get(authentication,check)



export default userRoutes 

