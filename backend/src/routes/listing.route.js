import express from "express";
import { upload } from "../middlewares/multer.middleware.js";

import {
  getAllItems,
  getById,
  searchListings,
  createListing,
  deleteListing,
  updateListing,
  getListingsByUserId
} from "../controllers/listing.controller.js";

const router = express.Router();

router.get("/get-all-items", getAllItems);
router.get("/search", searchListings); // Place this before `/:id`
router.get("/:id", getById);

// Route: Create listing with multiple images
router.post("/create-listing", upload.array("images", 15), createListing);

// Route: Update listing with new images (optional)
router.put("/update/:id", upload.array("images", 15), updateListing);

// Route: Delete listing
router.delete("/delete/:id", deleteListing);

router.get("/user/:userId", getListingsByUserId);



export default router;
