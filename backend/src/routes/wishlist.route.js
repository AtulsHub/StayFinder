import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  getWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Add a listing to wishlist
router.post("/add/:listingId", addToWishlist);

// Remove a listing from wishlist
router.delete("/remove/:listingId", removeFromWishlist);

// Clear all listings from wishlist
router.delete("/clear", clearWishlist);

router.get("/user/:userId", getWishlist);

export default router;
