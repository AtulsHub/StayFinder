import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createBookingAndOrder,
  verifyPayment,
  getAllBookings,
  getBookingById,
  deleteBooking,
  getBookingsByUser,
  getBookingsByListing
} from "../controllers/booking.controller.js";

const router = express.Router();
// Create Booking + Razorpay Order
router.post("/create-booking", createBookingAndOrder);

// Verify Payment
router.post("/verify-payment", verifyPayment);

// Get All Bookings (admin)
router.get("/", getAllBookings);

// Get Single Booking by ID
router.get("/:id", getBookingById);

//Get Bookings by User
router.get("/user/:userId", getBookingsByUser);

//Get Bookings by Listing
router.get("/listing/:listingId", getBookingsByListing);

// Delete/Cancel Booking
router.delete("/:id", deleteBooking);
export default router;
