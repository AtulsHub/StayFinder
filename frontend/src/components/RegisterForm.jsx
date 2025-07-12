import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userService from "../backendConnect/user";
import { login } from "../store/userSlice";
import { useDispatch } from "react-redux";
import GoogleLogin from "../components/auth/GoogleLogin";
import NotificationPopup from "./utils/NotificationBar";

const SignupPage = () => {
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(import.meta.env.VITE_GOOGLE_REDIRECT_URI);

  const showPopup = (message, type) => {
    setNotification({ message: message, type: "info" });
    // auto-close after 3s
  };

  const signUp = async (name, email, password) => {
    try {
      const response = await userService.registerUser(name, email, password);
      console.log(response.message);
      showPopup(response.message, "info");
      if (response.user) dispatch(login({ userData: response.user }));
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      showPopup(error.message, "error");
      console.log("login error", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      showPopup("Passwords do not match!");
      return;
    }

    signUp(name, email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-200 flex items-center justify-center px-4 py-4 md:p-8 relative">
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6 tracking-tight">
          New User <br />
          Create Account
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Create password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder="Re-enter password"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition shadow-lg"
          >
            Sign Up
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 font-semibold hover:underline"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
