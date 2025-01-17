import mongoose from "mongoose";

const connectDb=async ()=>{

    try {
        const conn= await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongoose connected:${conn.connection.host}`)
        
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
        process.exit(1)
    }
}
export default connectDb;

 