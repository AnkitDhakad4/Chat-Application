import express from "express";
import { signup } from "../controller/user.controller.js";

const userRoutes=express.Router()

userRoutes.route('/signup').post(signup)



export default userRoutes

