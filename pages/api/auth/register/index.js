// pages/api/user/register.js
import dbConnect from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    await dbConnect();

    const { email, pin } = req.body;

    // Input validation
    if (!email || !pin) {
      return res.status(400).json({
        message: "Email and PIN are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // PIN validation
    if (pin.length < 4) {
      return res.status(400).json({
        message: "PIN must be at least 4 characters long",
      });
    }

    // Check if user already exists
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Create new user
    const newUser = new User({
      email,
      pin, // Store hashed PIN
      createdAt: new Date(),
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}
