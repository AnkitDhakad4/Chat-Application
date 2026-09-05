import express from "express";
import { login, logout, signup, 
    // check
    updateProfilePic, updateProfile} from "../controller/user.controller.js";
import authentication from "../middleware/authMiddleWare.js";
import { groupInvitationsToUser
    // rejectedInvitations,acceptRejectedInvitation
} from "../controller/group.controller.js";

const userRoutes=express.Router()

userRoutes.route('/signup').post(signup)
userRoutes.route('/logout').post(logout)
userRoutes.route('/login').post(login)
userRoutes.route('/updateProfilePic').post(authentication,updateProfilePic)
userRoutes.route('/updateProfile').post(authentication,updateProfile)
userRoutes.route('/groupInvitations').get(authentication,groupInvitationsToUser)




export default userRoutes 

