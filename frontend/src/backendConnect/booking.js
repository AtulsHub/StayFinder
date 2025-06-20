import axios from "axios";

export class BookingService {
  url = "http://localhost:8000/api/v1/bookings";

  async createBooking(user, listing, checkIn, checkOut, totalPrice) {
    try {
      const response = axios.post(`${this.url}/`, {
        user,
        listing,
        checkIn,
        checkOut,
        totalPrice,
      });
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getAllBookings() {
    try {
      const response = axios.get(`${this.url}/`);
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getBookingById(bookingId) {
    try {
      const response = axios.get(`${this.url}/${bookingId}`);
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getBookingsByUser(userId) {
    try {
      const response = axios.get(`${this.url}/user/${userId}`);
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteBookingById(bookingId) {
    try {
      const response = axios.delete(`${this.url}/${bookingId}`);
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

const bookingService = new BookingService();
export default bookingService;
