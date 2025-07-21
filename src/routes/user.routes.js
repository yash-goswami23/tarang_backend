import { Router } from "express";
import {  
    signUpUser,
    signInUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser
} from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/signup").post(signUpUser);
userRouter.route("/signin").post(signInUser);
userRouter.route("/logout").post(verifyJwt, logoutUser);
userRouter.route("/refresh-token").post(verifyJwt, refreshAccessToken);
userRouter.route("/change-password").post(verifyJwt, changeCurrentPassword);
userRouter.route("/current-user").get(verifyJwt, getCurrentUser);


export default userRouter