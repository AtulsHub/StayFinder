import { Booking } from "../modals/booking.modal.js";
import { Listing } from "../modals/listing.modal.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendEmail } from "../config/emailService.js";
import axios from "axios";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1️⃣ Create booking + Razorpay order
export const createBookingAndOrder = async (req, res) => {
  try {
    const { user, listing, checkIn, checkOut, totalPrice, bookerEmail } =
      req.body;

    if (
      !user ||
      !listing ||
      !checkIn ||
      !checkOut ||
      !totalPrice ||
      !bookerEmail
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const receipt = `receipt_${Date.now()}`;
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: "INR",
      receipt,
      payment_capture: 1,
    });

    const booking = await Booking.create({
      user,
      listing,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalPrice,
      status: "PENDING",
      razorpayOrderId: razorpayOrder.id,
    });

    // 🟢 Add booked slot to the listing
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    await Listing.findByIdAndUpdate(
      listing,
      {
        $push: {
          bookedSlots: {
            startDateTime: startDate,
            endDateTime: endDate,
          },
        },
      }
    );

    res.status(201).json({
      message: "Booking created, order initiated, and listing updated",
      booking,
      razorpayOrder,
      bookerEmail,
      listing,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// 🔷 Helper: Create Invoice
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookerEmail,
      listingId,
    } = req.body;

    // 🔷 Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      await Booking.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "FAILED" }
      );

      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // 🔷 Update booking
    const booking = await Booking.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "CONFIRMED",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    const listing = await Listing.findById(listingId).populate("host");

    if (!listing) {
      console.error("Listing not found", listingId);
      return res.status(404).json({ message: "Listing not found" });
    }

    const ownerEmail = listing.host.email;

    // 🔷 Create Razorpay Invoice
    const invoice = await razorpay.invoices.create({
      type: "invoice",
      description: `Booking at StayFinder - ${listing.title}`,
      customer: {
        email: bookerEmail,
      },
      line_items: [
        {
          name: listing.title,
          amount: booking.totalPrice * 100, // in paise
          currency: "INR",
          quantity: 1,
        },
      ],
    });

    const invoiceUrl = invoice.short_url || "Invoice not available";

    // 🔷 Send Email to Guest
    await sendEmail(
      bookerEmail,
      "StayFinder Booking Confirmed ✅",
      `
Hi,

We’re excited to let you know that your booking at StayFinder has been confirmed! 🎉

📍 Listing: ${listing.title}
📅 Check-in: ${booking.checkIn.toDateString()}
📅 Check-out: ${booking.checkOut.toDateString()}
💰 Total Price: ₹${booking.totalPrice}

🧾 [View your Invoice here](${invoiceUrl})

Thank you for choosing StayFinder. We’re sure you’ll have a comfortable and memorable stay!

Happy travels,
The StayFinder Team 🌟
`
    );

    // 🔷 Send Email to Host
    await sendEmail(
      ownerEmail,
      "New Booking Received 🏠",
      `
Hello Sir,

Good news! You’ve received a new booking on StayFinder.

📍 Listing: ${listing.title}
📅 Check-in: ${booking.checkIn.toDateString()}
📅 Check-out: ${booking.checkOut.toDateString()}
👤 Guest: ${bookerEmail}
💰 Total Price: ₹${booking.totalPrice}

Thank you for hosting with StayFinder!

Best regards,
The StayFinder Team
`
    );

    return res.json({ success: true, booking, invoiceUrl });
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3️⃣ Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user listing");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 4️⃣ Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("user listing");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 5️⃣ Get bookings by user
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId }).populate("listing");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 6️⃣ Get bookings by listing
export const getBookingsByListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const bookings = await Booking.find({ listing: listingId, status: "CONFIRMED" })
      .populate("user", "name email")
      .populate("listing", "title")
      .sort({ checkIn: 1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings by listing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 7️⃣ Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 8️⃣ Update booking status (admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["PENDING", "CONFIRMED", "CANCELLED", "FAILED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user listing");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ 
      message: "Booking status updated successfully", 
      booking 
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 9️⃣ Cancel booking (user)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("listing");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking can be cancelled (only PENDING or CONFIRMED bookings)
    if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
      return res.status(400).json({ message: "This booking cannot be cancelled" });
    }

    // Update booking status to CANCELLED
    booking.status = "CANCELLED";
    await booking.save();

    res.status(200).json({ 
      message: "Booking cancelled successfully", 
      booking 
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
