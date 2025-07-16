import axios from "axios";

export class UserService {
  url = `${import.meta.env.VITE_BACKEND_URI}/users`;

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
      // console.log(response);

      return response.data;
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
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

  async googleRegister() {
    try {
      const response = await axios.get(`${this.url}/google`, {
        withCredentials: true,
      });
      return response.data;
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

  async performLogout() {
    try {
      const response = await axios.get(`${this.url}/logout`, {
        withCredentials: true, // important to include cookies
      });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  }

 async updateUser(userId, updatedData) {
  try {

    const response = await axios.put(`${this.url}/${userId}`, updatedData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
}

}

const userService = new UserService();
export default userService;
