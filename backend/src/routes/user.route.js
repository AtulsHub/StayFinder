import express from "express";
import passport from "passport";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import "../config/passport.js";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { User } from "../modals/user.modal.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     session: false,
//   })
// );
router.post(
  "/google",
  passport.authenticate("google-token", { session: false }),
  (req, res) => {
    try {
      const user = req.user;
      console.log(user);

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      // Redirect or respond with tokens (depends on frontend)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 15, // 15 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
      res.json({ success: true, user });
    } catch (error) {
      console.error("Google Callback Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
