import express from "express";
import passport from "passport";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import "../config/passport.js";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { User } from "../modals/user.modal.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    console.log(user);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Redirect or respond with tokens (depends on frontend)
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

    res.redirect(process.env.CLIENT_REDIRECT_URL); // e.g. http://localhost:8000/google-success
  }
);

router.get("/me", verifyJWT, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(202).json({
    message: "Login successful",
    user,
  });
});

export default router;
