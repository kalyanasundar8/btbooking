import bcrypt from "bcryptjs";
// Modal
import User from "../models/User.js";
import { GenerateToken } from "../utils/Token.js";
import { sendEmail, generateOTP } from "../utils/GmailService.js";

// Registe a user
const signup = async (req, res) => {
  const { username, mobilenumber, email, password } = req.body;

  // Check all the fields are entered
  if (!username || !mobilenumber || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check the email struct
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid email format. Please enter a valid email." });
  }

  // Check the mobilenumber
  const mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;

  if (!mobileRegex.test(mobilenumber)) {
    return res.status(400).json({
      message: "Invalid mobile number. Please enter a valid 10-digit number.",
    });
  }

  // Password check
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least one letter and one number.",
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 8);

  // Check user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Generate otp
  const otp = generateOTP();

  // Create a user
  const user = await User.create({
    username: username,
    mobilenumber: mobilenumber,
    email: email,
    otp: otp,
    password: hashedPassword,
  });

  if (user) {
    // Send a OTP mail
    sendEmail(user.email, user.otp);

    // Generate a token
    const token = GenerateToken(user._id);

    // Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      id: user._id,
      username: user.username,
      mobilenumber: mobilenumber,
      email: user.email,
      token: token,
    });
  }
};

// Verify the otp
const verifyOtp = async (req, res) => {
  const { otp } = req.body;
};

export { signup };
