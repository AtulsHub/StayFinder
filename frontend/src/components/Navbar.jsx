import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaUserCircle, FaHeart, FaSearch } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice";
import userService from "../backendConnect/user";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user.status);
  console.log(selector);

  const handleLogout = async () => {
    const response = await userService.performLogout();
    console.log(response);
    dispatch(logout()); // clears Redux + localStorage
    navigate("/");
  };
  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md md:sticky top-0 z-50">
        <div className="flex gap-2 justify-between items-center">
          <Sidebar />
          <Link to="/">
            <h1 className="text-2xl font-bold text-red-500">StayFinder</h1>
          </Link>
        </div>
        <div className="flex items-center justify-around gap-6 md:gap-10">
          <Link
            to="/"
            className="hover:text-red-500 hover:underline transition"
          >
            Home
          </Link>
          <Link
            to="/store"
            className="hover:text-red-500 transition hover:underline hidden md:block"
          >
            Explore
          </Link>
          <Link to="/wishlist">
            <FaHeart
              className="text-xl text-red-500 cursor-pointer hover:scale-110 transition"
              title="Wishlist"
            />
          </Link>
          <div
            className="hover:scale-110 duration-100 "
            onClick={() => {
              selector ? handleLogout() : navigate("/login");
            }}
          >
            <label>
              {selector ? (
                <FaUserCircle className="text-2xl cursor-pointer " />
              ) : (
                "Login"
              )}{" "}
            </label>
          </div>
          {selector && (
            <div
            className=" hover:text-red-500 hover:underline transition"
              onClick={() => {
                selector && handleLogout();
              }}
            >
              <label className="cursor-pointer">Logout</label>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
