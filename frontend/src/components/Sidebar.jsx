import React, { useState, useRef } from "react";
import {
  FaBars,
  FaHome,
  FaBed,
  FaUser,
  FaBook,
  FaSignOutAlt,
  FaBusinessTime,
  FaEdit,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, login } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import userService from "../backendConnect/user";
import NotificationPopup from "./utils/NotificationBar";

export let allowLogin = false;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selector = useSelector((state) => state.user.status);
  const hostType = useSelector((state) => state.user?.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const [notification, setNotification] = useState(null);
  const menuRef = useRef();
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    const response = await userService.performLogout();
    // console.log(response);

    dispatch(logout()); // clears Redux + localStorage
    navigate("/");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await userService.updateUser(hostType._id, formData);

      if (res?.user) {
        // console.log(res);

        dispatch(login({ userData: res.user }));
        setNotification({ message: "Profile picture updated!", type: "info" });
      } else {
        setNotification({
          message: "Failed to update profile picture",
          type: "info",
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        message: "Something went wrong while uploading",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex relative">
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-55 lg:hidden "
          onClick={closeSidebar}
        ></div>
      )}
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
          <span className="text-xs text-red-600 animate-pulse">Uploading…</span>
        </div>
      )}
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-red-500 text-white duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 z-60 md:hidden md:translate-x-0 md:w-64 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-black-700">
          <h1 className="text-2xl font-bold">StayFinder</h1>
          <button onClick={closeSidebar} className="text-white md:hidden">
            ✕
          </button>
        </div>

        {/* wrapped nav inside scrollable container */}
        <div className="flex-1 overflow-y-auto scrollbar-hidden">
          <nav className="flex flex-col gap-4 p-4">
            {selector && (
              <div className="px-4 py-3 border-b flex flex-col items-center gap-2">
                <div className="relative">
                  <img
                    src={hostType?.avatar}
                    alt={hostType?.name || "User"}
                    className="h-24 w-24 rounded-full shadow-lg object-contain bg-gradient-to-r from-red-400 to-purple-400"
                  />
                  <FaEdit
                    className="h-5 w-5 absolute bottom-2 right-2 text-red-500 cursor-pointer bg-white rounded-full p-1"
                    onClick={() => fileInputRef.current.click()}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {uploading && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs bg-black/50 text-white rounded-full animate-pulse">
                      Uploading…
                    </span>
                  )}
                </div>
                <p className="text-sm">Signed in as</p>
                <p className="text-sm font-medium truncate">
                  {hostType?.email || "User"}
                </p>
              </div>
            )}
            <SidebarLink to="/" icon={<FaHome />} label="Home" />
            <SidebarLink to="/store" icon={<FaBed />} label="Explore Hotels" />
            <SidebarLink to="#" icon={<FaBook />} label="Bookings" />
            <SidebarLink to="#" icon={<FaUser />} label="Profile" />
            {selector && (
              <SidebarLink
                to={
                  hostType?.hostType === "admin" ||
                  hostType?.hostType === "owner"
                    ? "/owner"
                    : "/register-business"
                }
                icon={<FaBusinessTime />}
                label="Your Business"
              />
            )}
            {selector && (
              <SidebarLink
                to={
                  hostType?.hostType === "admin" 
                    ? "/admin"
                    : ""
                }
                icon={<FaBusinessTime />}
                label="Admin Dashboard"
              />
            )}


            <div
              className="flex items-center gap-4 p-2 hover:bg-red-600 cursor-pointer rounded transition text-lg"
              onClick={() => {
                selector
                  ? handleLogout()
                  : ((allowLogin = true), navigate("/login"));
              }}
            >
              <FaSignOutAlt />
              <label>{selector ? "Logout" : "Login"} </label>
            </div>
            <div className="py-8"></div>
          </nav>
        </div>
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
