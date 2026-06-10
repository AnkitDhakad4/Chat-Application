import express from "express";
import { login, logout, signup, check,updateProfilePic} from "../controller/user.controller.js";
import authentication from "../middleware/authMiddleWare.js";
import { groupInvitationsToUser,rejectedInvitations,acceptRejectedInvitation} from "../controller/group.controller.js";

const userRoutes=express.Router()

userRoutes.route('/signup').post(signup)
userRoutes.route('/logout').post(logout)
userRoutes.route('/login').post(login)
userRoutes.route('/check').get(authentication,check)
userRoutes.route('/updateProfilePic').post(authentication,updateProfilePic)
userRoutes.route('/groupInvitations').get(authentication,groupInvitationsToUser)
userRoutes.route('/rejectedInvitations').get(authentication,rejectedInvitations)
userRoutes.route('/acceptRejectedInvitation').post(authentication,acceptRejectedInvitation)

export default userRoutes 

