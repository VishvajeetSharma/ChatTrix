import "dotenv/config"
import express from "express";
import router from "./routes/auth.route.js";
const  app = express();
const PORT = process.env.PORT || 3000;

app.use(`/api/auth`, router);

app.listen(PORT, ()=>{
  console.log(`Sever is Running on:  http://localhost:${PORT}`);
});
