import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';


export const verifyJwt = asyncHandler(async(req, res, next)=>{
    try {
        const token =  req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");
    
        if(!token){
            throw new ApiError(401, "Unauthorized request");
        }
    
        const decodedToken =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user = user;
        next();
    }catch (error) {
  if (error.name === "JsonWebTokenError" && error.message === "jwt malformed") {
    throw new ApiError(401, "Access Token format is invalid");
  }
  if (error.name === "TokenExpiredError") {
    throw new ApiError(401, "Access Token has expired");
  }
  throw new ApiError(401, error?.message || "Invalid access token");
}
})