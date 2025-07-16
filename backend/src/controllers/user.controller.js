import { User } from "../modals/user.modal.js";
import validator from "validator";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, isHost } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    // Check password strength (optional)
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    let avatarUrl = "";

    if (req.file?.path) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (uploaded) {
        avatarUrl = uploaded.secure_url;
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      isHost,
      avatar: avatarUrl,
    });

    // Generate tokens
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 1000 * 60 * 15,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    // Send response without tokens
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isHost: newUser.isHost,
        avatar: newUser.avatar,
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


const editUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.hostType) user.hostType = req.body.hostType;
console.log(req.file);

    // ✅ Handle avatar update if file uploaded
    if (req.file?.path) {
      const cloudinaryResult = await uploadOnCloudinary(req.file.path);
      if (!cloudinaryResult) {
        return res
          .status(500)
          .json({ message: "Failed to upload avatar to Cloudinary" });
      }
      user.avatar = cloudinaryResult.secure_url; // update with Cloudinary URL
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Edit user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export { registerUser, loginUser, logoutUser, editUser };
