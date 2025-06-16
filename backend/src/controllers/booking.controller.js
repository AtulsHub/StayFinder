import {Booking} from "../modals/booking.modal.js";
import {Listing} from "../modals/listing.modal.js";

export const createBooking = async (req, res) => {
  try {
    const { user, listing, checkIn, checkOut, totalPrice } = req.body;

    if (!user || !listing || !checkIn || !checkOut || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = await Booking.create({
      user,
      listing,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalPrice
    });
    console.log(booking);
    
    res.status(201).json({
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user listing");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const {id} = req.params
    if(!id){
      return res.status(400).json({ message: "Booking id required" });
    }
    const booking = await Booking.findById(id).populate("user listing");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    console.error("Get Booking By ID Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const {userId} = req.params
    if(!userId){
      return res.status(400).json({ message: "User id required" });
    }
    const bookings = await Booking.find({ user: userId }).populate("listing");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get Bookings By User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const {id} = req.params
    if(!id){
      return res.status(400).json({ message: "Booking id required" });
    }
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
