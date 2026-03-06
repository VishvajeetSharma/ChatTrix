import "dotenv/config";
import mongoose from "mongoose"

const DB_URI = process.env.MONGODB_URI
export const connectDB = async ()=>{
  try{
    const conn = await mongoose.connect(DB_URI);
    console.log(`MongoDB connected at: ${conn.connection.host}`);
    
  }catch(error){
    console.log(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
}