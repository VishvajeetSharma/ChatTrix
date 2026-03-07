import "dotenv/config"
import express from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" })
    }

    const { userId } = decoded
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log(`Error in protectedRoute middleware: ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}