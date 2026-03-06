import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

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
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: createdUser
    });

  } catch (error) {
    // Handle server error
    console.log(`Error in signup controller, ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const login = async (req, res) => {
  const {email, password} = req.body;

  try{
    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({message: "Invalid credientials"});
    }

    const isCorrectPassroed = bcrypt.compare(password, user.password);
    if(!isCorrectPassroed){
      return res.status(400).json({message: "Invalid credientials"});
    }

    generateToken(user._id, res)
    res.status(200).json({
      success: true,
      message: "User login succesfully",
      data: user
    })
  }catch(error){
    // Handle server error
    console.log(`Error in signup controller, ${error.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const logout = (req, res) => {
  res.send("logout route");
}