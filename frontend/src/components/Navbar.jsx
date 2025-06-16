import React from "react";
import { Link } from "react-router-dom";

import { FaUserCircle, FaHeart } from "react-icons/fa";

const Navbar = () => (
  <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50">
    <h1 className="text-2xl font-bold text-red-500">StayFinder</h1>
    <div className="flex items-center gap-6">
      <a href="#" className="hover:text-red-500 transition">
        Home
      </a>
      <a href="#" className="hover:text-red-500 transition">
        Explore
      </a>
      <a href="#" className="hover:text-red-500 transition">
        Login
      </a>
      <FaHeart
        className="text-xl text-red-500 cursor-pointer hover:scale-110 transition"
        title="Wishlist"
      />
      <FaUserCircle className="text-2xl" />
    </div>
  </nav>
);

export default Navbar;
