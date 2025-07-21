import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const signUpUser = asyncHandler(async (req, res) => {
    // get full name, email, password
    const {name, email, password} =  req.body;
    // validation 
    
    if(!name)  throw new ApiError(400, "Full Name is required");
    if(!email) throw new ApiError(400, "Email is required");
    if(!password) throw new ApiError(400, "Password is required");

    const existedUser = await User.findOne({email});
    if(existedUser) throw new ApiError(409, "User with email or username already exists");

    const user = await User.create({name, email, password});
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser) throw new ApiError(500, "Something went wrong while registering the user");

    return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfuly"));
});

const signInUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    if(!email) throw new ApiError(400, "Email is required");
    if(!password) throw new ApiError(400, "Password is required");

    const user = await User.findOne({email});

    if(!user) throw new ApiError(404, "User does not exist");


const isPasswordCorrect = await user.isPasswordCorrect(password);
if (!isPasswordCorrect) {
  throw new ApiError(400, "Invalid password");
}
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(new ApiResponse(200, {
    user: loggedInUser,
    accessToken,
    refreshToken
  }, "User logged in successfully"));

})

const generateAccessAndRefreshTokens = async (userID) => {
    try {
        const user = await User.findById(userID);
    
        const accessToken = await user.generateAccessToken();
        const refreshToken =await user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const logoutUser = asyncHandler(async(req, res)=> {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {refreshToken: undefined},
    }, {
        new: true
    });
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));

  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});


const changeCurrentPassword = asyncHandler(async(req, res)=>{
const { oldPassword, newPassword } = req.body;

if (!oldPassword || !newPassword) {
  throw new ApiError(400, "Both old and new passwords are required");
}
if (newPassword.length < 8) {
  throw new ApiError(400, "Password must be at least 8 characters long");
}
if (oldPassword === newPassword) {
  throw new ApiError(400, "New password must be different from old password");
}

const user = await User.findById(req.user?._id);
if (!user) {
  throw new ApiError(404, "User not found");
}

const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
if (!isPasswordCorrect) {
  throw new ApiError(400, "Invalid old password");
}

user.password = newPassword;
await user.save({ validateBeforeSave: false });

return res.status(200).json(new ApiResponse(200, {}, "Password Changed"));
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, "Current user fetched successfully")
  );
});

export {
    signUpUser,
    signInUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
}