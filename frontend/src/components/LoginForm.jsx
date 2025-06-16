import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice.js";

import userService from "../backendConnect/user.js"
import { useNavigate } from "react-router-dom";

export default function LoginForm({ isOpen, onClose, isLogin = true }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()
const verifyUser = async (email, password) => {
  try {
    const response = await userService.loginUser(email, password);
    console.log("Login response:", response);
      dispatch(login({ userData: response.user }));
      navigate("/")
    
  } catch (error) {
    console.log("Login error:", error.message);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isLogin ? "Login to StayFinder" : "Create an Account"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md p-2"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            console.log();
            
          }}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-md p-2"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <button
          className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition"
          onClick={() => {verifyUser(email, password)}}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-indigo-600 font-semibold"

          >
            {isLogin ? "Register" : "Login"}
           
          </button>
        </p>

        <button
          onClick={() => onClose("close")}
          className="absolute top-4 right-6 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <button className="w-full h-10 bg-blue-300 overlay-hidden"
        onClick={async () => (

          window.location.href = `http://localhost:8000/api/v1/users/google`
        )}>
          Google Login
          </button>
      </div>
    </div>
  );
}
