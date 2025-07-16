import axios from "axios";

export class BookingService {
  url = "http://localhost:8000/api/v1/bookings";

  // create booking
  async createBooking({ user, listing, checkIn, checkOut, totalPrice, bookerEmail }) {
    try {
      const { data } = await axios.post(`${this.url}/create-booking`, {
        user,
        listing,
        checkIn,
        checkOut,
        totalPrice,
        bookerEmail,
      });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  // get all bookings
  async getAllBookings() {
    try {
      const { data } = await axios.get(`${this.url}/`);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  // get booking by ID
  async getBookingById(bookingId) {
    try {
      const { data } = await axios.get(`${this.url}/${bookingId}`);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  // get bookings by user
  async getBookingsByUser(userId) {
    try {
      const { data } = await axios.get(`${this.url}/user/${userId}`);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  // delete booking by ID
  async deleteBookingById(bookingId) {
    try {
      const { data } = await axios.delete(`${this.url}/${bookingId}`);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  // verify payment
  async verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, bookerEmail, listingId }) {
    try {
      const { data } = await axios.post(`${this.url}/verify-payment`, {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookerEmail,
        listingId,
      });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
}

const bookingService = new BookingService();
export default bookingService;
