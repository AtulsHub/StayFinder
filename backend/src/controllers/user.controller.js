import { User } from "../modals/user.modal.js";
import validator from "validator";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, isHost } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // ✅ Validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    // ✅ Check password strength (optional)
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }

    // ✅ Create new user
    const newUser = await User.create({ name, email, password, isHost });

    // ✅ Generate tokens
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    // ✅ Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 1000 * 60 * 15, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // ✅ Send response without tokens
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isHost: newUser.isHost,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(404).json({ message: "Enter required credentials" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify password
    const isMatch = await user.isPasswordCorrect(password);
    console.log(password);

    console.log(isMatch);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // ✅ Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true only in prod with HTTPS
      sameSite: "None",
      maxAge: 1000 * 60 * 15, // 15 minutes
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true only in prod with HTTPS
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isHost: user.isHost,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
 try {
   res.clearCookie("accessToken", {
     httpOnly: true,
     secure: false, // true only in prod with HTTPS
     sameSite: "None",
     path: "/",
   });
 
   res.clearCookie("refreshToken", {
     httpOnly: true,
     secure: false, // true only in prod with HTTPS
     sameSite: "None",
     path: "/",
   });
 
   return res.status(200).json({ message: "Logged out successfully" });
 } catch (error) {
   console.error("Logout Error:", error);
   return res.status(500).json({ message: "Internal server error" });
  
 }
};

export { registerUser, loginUser, logoutUser };
