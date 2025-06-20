import React, { useState } from "react";
import {
  FaBars,
  FaHome,
  FaBed,
  FaUser,
  FaBook,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import userService from "../backendConnect/user";


export let allowLogin = false;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selector = useSelector((state) => state.user.status);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

const handleLogout = async () => {
  const response = await userService.performLogout();
  console.log(response);
  
  dispatch(logout()); // clears Redux + localStorage
  navigate("/");
};

  return (
    <div className="flex relative">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-55 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-red-500 text-white duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 z-60 md:hidden md:translate-x-0 md:w-64`}
      >
        <div className="flex items-center justify-between p-4 border-b border-black-700">
          <h1 className="text-2xl font-bold">StayFinder</h1>
          <button onClick={closeSidebar} className="text-white md:hidden">
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-4">
          <SidebarLink to="/" icon={<FaHome />} label="Home" />
          <SidebarLink to="/store" icon={<FaBed />} label="Explore Hotels" />
          <SidebarLink to="#" icon={<FaBook />} label="Bookings" />
          <SidebarLink to="#" icon={<FaUser />} label="Profile" />
          <div
          className="flex items-center gap-4 p-2 hover:bg-red-600 cursor-pointer rounded transition"
          onClick={() => {
            selector ? handleLogout() : (allowLogin = true, navigate("/login"));
          }}
        >
          <FaSignOutAlt /><label>{selector ? "Logout" : "Login"} </label>
        </div>
        </nav>
      </div>

      {/* Content */}
      <div className="flex justify-center items-center ">
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="text-red-500 rounded md:hidden"
        >
          <FaBars className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex text-xl items-center gap-4 p-2 hover:bg-red-600 rounded transition"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Sidebar;
