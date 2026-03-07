import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

// Signup Controller
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body

  try {
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 character" });
    }

    // Validate input filds
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exist" });
    }

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })

    // Save user in database
    const createdUser = await newUser.save();

    // Generate JWT token
    generateToken(createdUser._id, res);

    // Send success response
    res.status(201).json({ createdUser });

  } catch (error) {
    // Handle server error
    console.log(`Error in signup controller, ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credientials" });
    }

    const isCorrectPassroed = bcrypt.compare(password, user.password);
    if (!isCorrectPassroed) {
      return res.status(400).json({ message: "Invalid credientials" });
    }

    generateToken(user._id, res)
    res.status(200).json({ user })
  } catch (error) {
    // Handle server error
    console.log(`Error in login controller, ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(`Error is logout controller, ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.file;

    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile Picture is Required" });
    }



    const uploadResponce = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponce.secure_url }, { new: true });

    res.status(200).json({ updatedUser });

  } catch (error) {
    console.log(`Error is update profile controller, ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
}
