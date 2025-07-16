import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaHeart } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { logout, login } from "../store/userSlice";
import userService from "../backendConnect/user";
import NotificationPopup from "./utils/NotificationBar";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user.status);
  const user = useSelector((state) => state.user.userData);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef();
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleLogout = async () => {
    const response = await userService.performLogout();
    console.log(response);
    dispatch(logout()); // clears Redux + localStorage
    navigate("/");
  };

  // 🔷 Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await userService.updateUser(user._id, formData);

      if (res?.user) {
        console.log(res);

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
    <>
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md md:sticky top-0 z-50">
        <div className="flex gap-2 justify-between items-center">
          <Sidebar />
          <Link to="/">
            <h1 className="text-2xl font-bold text-red-500">StayFinder</h1>
          </Link>
        </div>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
            <span className="text-xs text-red-600 animate-pulse">
              Uploading…
            </span>
          </div>
        )}

        <div className="flex items-center justify-around gap-6 md:gap-10">
          <Link
            to="/"
            className="hover:text-red-500 hover:underline transition hidden md:block"
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

          <div className="relative" ref={menuRef}>
            <div
              className="hover:scale-110 duration-100 shadow-2xl"
              onClick={() => {
                if (!selector) {
                  navigate("/login");
                } else {
                  setShowProfileMenu((prev) => !prev);
                }
              }}
            >
              {selector ? (
                <img
                  src={user.avatar || user.name.charAt(0)}
                  className="text-2xl cursor-pointer h-8 w-8 rounded-full border-2 border-red-400 text-center object-contain bg-gradient-to-r from-red-400 to-purple-400"
                />
              ) : (
                <label className="cursor-pointer">Login</label>
              )}
            </div>

            {showProfileMenu && selector && (
              <div className="absolute right-0 mt-2 w-68 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="px-4 py-3 border-b flex-col flex items-center">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-30 w-30 rounded-full shadow-lg p-2 bg-gradient-to-r from-red-400 to-purple-400 text-center object-contain"
                    />
                    <FaEdit
                      className="h-5 w-5 absolute bottom-2 right-2  text-red-500 hover:text-red-600 hover:scale-110 duration-200 cursor-pointer bg-white"
                      onClick={() => fileInputRef.current.click()}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Signed in as</p>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user?.email || "User"}
                  </p>
                </div>
                {selector && (
                  <Link
                    to={
                      user?.hostType === "admin" || user?.hostType === "owner"
                        ? "/owner"
                        : "/register-business"
                    }
                  >
                    <label className="block w-full text-center px-4 py-2 border-b text-red-600 hover:bg-red-100 hover:text-red-700 transition">
                      {" "}
                      Your Business
                    </label>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-2 rounded-b-xl text-red-600 hover:bg-red-100 hover:text-red-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
