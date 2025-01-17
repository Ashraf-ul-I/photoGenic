import express from "express";
import dotenv from 'dotenv';
import connectDb from "./db/connectDb.js";
import cookieParser from "cookie-parser";
//Router imports
import authRoutes from './routes/authRoutes.routes.js'
import uploadImageRoutes from './routes/uploadImages.routes.js';
import authenticateUser from "./utils/authentiCateUser.js";

const app=express();
//converting the uri parameter to string
dotenv.config();

//All middlewares are being called here
app.use(cookieParser());
app.use(express.json());
//declaring the port 
const PORT=process.env.PORT;

//declaring all the router in here

app.use('/api/v1/auth',authRoutes);

app.use('/api/v1/image/',authenticateUser,uploadImageRoutes)

//listen the server
app.listen(PORT,()=>{
    //database connection
    connectDb();
    console.log(`server is running on ${PORT}`);
})