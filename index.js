import express from "express";
import dotenv from 'dotenv';
import connectDb from "./db/connectDb.js";
import cookieParser from "cookie-parser";
const app=express();
dotenv.config();

//All middlewares are being called here
app.use(cookieParser());
app.use(express.json());
//declaring the port 
const PORT=process.env.PORT;

//listen the server
app.listen(PORT,()=>{
    //database connection
    connectDb();
    console.log(`server is running on ${PORT}`);
})