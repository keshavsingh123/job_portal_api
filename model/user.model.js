import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[4,"password should be greater than 3 char"],
        select:true
    },
    location:{
        type:String,
        default:"mumbai"
    }
},
{
    timestamps:true
})
userSchema.pre('save',async function(){
    if(!this.isModified) return             //inbuilt function
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})
userSchema.methods.comparePwd =async function(userPwd){  //creating custom method comparePwd
    const isMatch = await bcrypt.compare(userPwd,this.password)
    return isMatch
}
userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:'1d'})
}

export default mongoose.model("User",userSchema)