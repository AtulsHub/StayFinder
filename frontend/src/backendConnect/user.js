import axios from "axios";

export class UserService {
  url = "http://localhost:8000/api/v1/users";

  async registerUser(name, email, password) {
    try {
      const response = await axios.post(
        `${this.url}/register`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      return await response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  async loginUser(email, password) {
    try {
      const response = await axios.post(
        `${this.url}/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      return await response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  async googleRegister() {
    try {
      const response = await axios.get(`${this.url}/google`, {
        withCredentials: true,
      });
      return await response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
  // after redirect
  async fetchLoggedInUser() {
    try {
      const response = await axios.get(`${this.url}/me`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }
}

const userService = new UserService();
export default userService;
