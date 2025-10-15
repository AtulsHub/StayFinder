import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createBookingAndOrder,
  verifyPayment,
  getAllBookings,
  getBookingById,
  deleteBooking,
  getBookingsByUser,
  getBookingsByListing,
  updateBookingStatus,
  cancelBooking
} from "../controllers/booking.controller.js";

const router = express.Router();

// Create Booking + Razorpay Order
router.post("/create-booking", createBookingAndOrder);

// Verify Payment
router.post("/verify-payment", verifyPayment);

// Get All Bookings (admin)
router.get("/", getAllBookings);

// Get Bookings by User (must come before /:id)
router.get("/user/:userId", getBookingsByUser);

// Get Bookings by Listing (must come before /:id)
router.get("/listing/:listingId", getBookingsByListing);

// Update Booking Status (admin) (must come before /:id)
router.patch("/:id/status", updateBookingStatus);

// Cancel Booking (user) (must come before /:id)
router.patch("/:id/cancel", cancelBooking);

// Get Single Booking by ID
router.get("/:id", getBookingById);

// Delete/Cancel Booking
router.delete("/:id", deleteBooking);

export default router;
