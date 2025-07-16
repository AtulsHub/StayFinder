import axios from "axios";

export class ListingService {
  url = "http://localhost:8000/api/v1/listing";

  async getAllItems(page, perPage) {
    try {
      const response = await axios.get(
        `${this.url}/get-all-items?page=${page}&perPage=${perPage}`
      );
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async searchListings(location, checkin, checkout, page, perPage) {
    try {
      const response = await axios.get(
        `${this.url}/search?location=${location}&checkin=${checkin}&checkout=${checkout}&page=${page}&perPage=${perPage}`
      );
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getListingById(itemId) {
    try {
      const response = await axios.get(`${this.url}/${itemId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async addListing(formData) {
    try {
      const response = await axios.post(
        `${this.url}/create-listing`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  async updateListing(id, data) {
    try {
      const formData = new FormData();

      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.pricePerNight)
        formData.append("pricePerNight", data.pricePerNight);
      if (data.host) formData.append("host", data.host);
      if (data.location)
        formData.append("location", JSON.stringify(data.location));
      if (data.availableDates)
        formData.append("availableDates", JSON.stringify(data.availableDates));

      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      // // console.log(`Updating listing ${id}`);
      // for (const [key, val] of formData.entries()) {
      //   // console.log(key, val);
      // }

      const response = await axios.put(`${this.url}/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getListingsByUserId(userId) {
    try {
      const response = await axios.get(`${this.url}/user/${userId}`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  // ✅ Delete listing
  async deleteListing(id) {
    try {
      const response = await axios.delete(`${this.url}/delete/${id}`);
      return response.data;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

const listingService = new ListingService();
export default listingService;
