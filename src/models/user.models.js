import jwt from "jsonwebtoken";
import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt';


const userSchema = new Schema({
    email:{
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    name:{
        type: String, 
        required: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, 'Passwod is required']
    }, 
    refreshToken: {
        type: String
    }
},{
    timestamps: true
});

//change password 
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
})

// check pass currect or not
userSchema.methods.isPasswordCorrect = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};
//generateAccessToken
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({_id: this._id, email: this.email}, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:    process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

//generateRefreshToken
userSchema.methods.generateRefreshToken = async function ()  {
    return jwt.sign(
        {_id: this._id, email: this.email},
         process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:    process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}


export const User = mongoose.model('User', userSchema);