import axios from "axios";

export class SettingsService {
  url = `${import.meta.env.VITE_BACKEND_URI}/settings`;

  // Get settings
  async getSettings() {
    try {
      const response = await axios.get(this.url, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  // Update settings
  async updateSettings(settingsData) {
    try {
      const response = await axios.put(this.url, settingsData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  // Reset settings to default
  async resetSettings() {
    try {
      const response = await axios.post(`${this.url}/reset`, {}, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
}

const settingsService = new SettingsService();
export default settingsService;
