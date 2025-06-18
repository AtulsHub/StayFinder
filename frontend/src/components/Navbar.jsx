import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaUserCircle, FaHeart, FaSearch } from "react-icons/fa";

const Navbar = ({className}) => (
  <>
  <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md md:sticky top-0 z-50">
    <Link to="/">
      <h1 className="text-2xl font-bold text-red-500">StayFinder</h1>
    </Link>
    <div className="flex items-center gap-6">
      <Link to="/" className="hover:text-red-500 transition">
        Home
      </Link>
      <Link to="/store" className="hover:text-red-500 transition">
        Explore
      </Link>
      <Link to="/login" className="hover:text-red-500 transition">
        Login
      </Link>
      <Link to="/wishlist">
        <FaHeart
          className="text-xl text-red-500 cursor-pointer hover:scale-110 transition"
          title="Wishlist"
        />
      </Link>
      <FaUserCircle className="text-2xl" />
    </div>
  </nav>
    
  </>
);

export default Navbar;
