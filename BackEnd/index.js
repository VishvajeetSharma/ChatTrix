import "dotenv/config"
import express from "express";

const  app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log(`Sever is Running on:  http://localhost:${PORT}`);
});
