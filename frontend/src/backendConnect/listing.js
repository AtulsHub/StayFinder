import axios from "axios";

export class ListingService {
  url = "http://localhost:8000/api/v1/listing";

  async getAllItems() {
    try {
      const response = await axios.get(
        `${this.url}/get-all-items`
      );
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async searchListings(location, checkin, checkout) {
    try {
      const response = await axios.get(
        `${this.url}/search?location=${location}&checkIn=${checkin}&checkout${checkout}`
      );
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getListingById(itemId) {
    try {
      const response = await axios.get(`${this.url}/${itemId}`
       );
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

const listingService = new ListingService();
export default listingService;
