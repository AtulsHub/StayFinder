import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import userService from "../backendConnect/user";
import { useNavigate } from "react-router-dom";
import { login } from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import GoogleLogin from "./auth/GoogleLogin";

const LoginPage = () => {
  const [popup, setPopup] = useState({ show: false, message: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user.status);

  const showPopup = (message) => {
    setPopup({ show: true, message });
    setTimeout(() => setPopup({ show: false, message: "" }), 3000); // auto-close after 3s
  };

  const logIn = async (email, password) => {
    try {
      const response = await userService.loginUser(email, password);
      console.log(response.message);
      showPopup(response.message);
      if (response.user) dispatch(login({ userData: response.user }));
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      showPopup(error.message);
      console.log("login error", error);
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    // actual auth here...
    logIn(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-200 flex items-center justify-center px-4 py-4 md:p-8 relative">
      {popup.show && (
        <div className="absolute top-5 px-6 py-3 bg-green-300 border border-gray-200 shadow-lg rounded-xl text-sm text-gray-800 z-50 animate-fade-in-down">
          {popup.message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full animate-fade-in">
        <h2 className="text-4xl font-bold text-center text-red-600 mb-6 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Log in to continue booking your perfect stay
        </p>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition shadow-lg"
          >
            Log In
          </button>
        </form>

        <div className="my-6 text-center text-gray-400 relative">
          <span className="bg-white px-3 relative z-10">OR</span>
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 z-0" />
        </div>

        <GoogleLogin>
          <FaGoogle className="text-red-500 text-lg" />
          <span className="text-sm font-medium text-gray-700">
            Continue with Google
          </span>
        </GoogleLogin>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-red-500 font-semibold hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
