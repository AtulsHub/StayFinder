import axios from "axios";

export class WishlistService {
  url = `${import.meta.env.VITE_BACKEND_URI}/wishlist`;

  async addToWishlist(userId, listingId) {
    try {
      const response = await axios.post(
        `${this.url}/add/${listingId}`,
        { userId },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  async removeFromWishlist(userId, listingId) {
    try {
      const response = await axios.delete(
        `${this.url}/remove/${listingId}`,
        {
          data: { userId },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  async clearWishlist(userId) {
    try {
      const response = await axios.delete(`${this.url}/clear`, {
        data: { userId },
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  async getWishlist(userId) {
    try {
      const response = await axios.get(`${this.url}/user/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
}

const wishlistService = new WishlistService();
export default wishlistService;
