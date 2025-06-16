import axios from "axios";

export class ListingService {
  url = "http://localhost:8000/api/v1/listing";

  async getAllItems() {
    try {
      const response = axios.get(
        `${this.url}/get-all-items`
      );
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async searchListings(location, checkin, checkout) {
    try {
      const response = axios.get(
        `${this.url}/search?location=${location}&checkIn=${checkin}&checkout${checkout}`
      );
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getListingById(itemId) {
    try {
      const response = axios.get(`${this.url}/${itemId}`
       );
      return await response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

const listingService = new ListingService();
export default listingService;
