import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUser,
  deleteBooking
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/",verifyJWT, createBooking);
router.get("/",verifyJWT, getAllBookings);
router.get("/:id",verifyJWT, getBookingById);
router.get("/user/:userId",verifyJWT, getBookingsByUser);
router.delete("/:id",verifyJWT, deleteBooking);

export default router;
