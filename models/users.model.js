import mongoose, { Schema } from "mongoose";

const userSchema= new Schema({
    userName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    lastLogin:{
        type:Date,
        default:Date.now()
    },
    userRole:{
        type:String,
        default:'user'
    },
    profilePic:{
        type:String,
    },
    forgetPassToken:{
        type:String
    }

},{timestamps:true});

export const User= mongoose.model('User',userSchema)