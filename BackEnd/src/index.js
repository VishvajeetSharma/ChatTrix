import "dotenv/config"
import express from "express";
import authRoute from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

const  app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.use(`/api/auth`, authRoute);

app.listen(PORT, ()=>{
  console.log(`Sever is Running on:  http://localhost:${PORT}`);
  connectDB();
});
