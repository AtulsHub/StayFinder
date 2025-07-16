import React, { useEffect } from "react";
import {
  FaStar,
  FaWifi,
  FaSwimmer,
  FaParking,
  FaUtensils,
  FaMapMarkerAlt,
  FaUserCircle,
  FaShareAlt,
  FaHeart,
  FaEdit,
} from "react-icons/fa";
import { reviews } from "../pages/Home";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import listingService from "../backendConnect/listing";
import "react-calendar/dist/Calendar.css";
import BookingSection from "./BookingSection";
import { useRef } from "react";
import ImageGalleryExpand from "./utils/ImageGalleryExpand";
import { useDispatch, useSelector } from "react-redux";
import { logout, login } from "../store/userSlice";
import userService from "../backendConnect/user";
import Sidebar from "./Sidebar";
import WishlistIcon from "./utils/WishlistIcon";
import NotificationPopup from "./utils/NotificationBar";

const HotelProductPage = () => {
  const [hotel, setHotel] = useState({});
  const [similarHotels, setSimilarHotels] = useState([]);
  const [show, setShow] = useState(false);
  const { id } = useParams();
  const bookingRef = useRef();
  const [showImage, setShowImage] = useState(false);
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
    dispatch(logout());
    navigate("/");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await userService.updateUser(user._id, formData);

      if (res?.user) {
        dispatch(login({ userData: res.user }));
        setNotification({ message: "Profile picture updated!", type: "info" });
      } else {
        setNotification({
          message: "Failed to update profile picture",
          type: "info",
        });
      }
    } catch (err) {
      setNotification({
        message: "Something went wrong while uploading",
        type: "info",
      });
    } finally {
      setUploading(false);
    }
  };

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

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await listingService.getListingById(id);
        setHotel(response.item);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListing();
  }, [id]);

  useEffect(() => {
    const similarListing = async () => {
      if (!hotel.location?.state) return; // wait until location is loaded
      try {
        const response = await listingService.searchListings(
          hotel.location.state && hotel.location.city,
          null,
          null,
          1,
          10
        );
        setSimilarHotels(response.listings);
      } catch (error) {
        console.log(error);
      }
    };

    similarListing();
  }, [hotel.location]);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const amenities = [
    {
      title: "Free WiFi",
      icon: <FaWifi className=" w-6 h-6" />,
    },
    {
      title: "Swimming Pool",
      icon: <FaSwimmer className=" w-6 h-6" />,
    },
    {
      title: "Free Parking",
      icon: <FaParking className=" w-6 h-6" />,
    },
    {
      title: "Restaurant",
      icon: <FaUtensils className=" w-6 h-6" />,
    },
  ];

  return (
    <>
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {showImage && (
        <ImageGalleryExpand
          images={hotel?.images || []}
          setShowImage={setShowImage}
        />
      )}

      {/* Navbar */}

      <nav className="md:flex flex-col justify-between md:items-between md:px-6 px-2 py-3 bg-white shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center w-full md:w-auto">
          <div className="flex">
            <Sidebar />
            <Link to="/" className=" flex md:inline-block">
              <h1 className="text-2xl font-bold text-red-500">StayFinder</h1>
            </Link>
          </div>
          <div className="md:flex flex-col-reverse md:flex-row inline-block justify-around items-center md:items-center gap-4">
            <div className="items-center font-semibold rounded-lg md:mx-6 hidden md:flex">
              <h3 className="w-50  ">
                <span className="text-red-600 text-xl">
                  ₹ {hotel?.pricePerNight}
                </span>
                /night
              </h3>
              <button
                className=" bg-red-500 w-full h-10 hover:bg-red-400 cursor-pointer text-white text-md rounded-lg"
                onClick={scrollToBooking}
              >
                Book Now
              </button>
            </div>
            <div className="flex items-between md:gap-10 gap-8">
              <Link
                to="/"
                className="hover:text-red-500 transition mt-1 hidden md:block"
              >
                Home
              </Link>
              <Link
                to="/store"
                className="hover:text-red-500 transition hidden md:block mt-1"
              >
                Explore
              </Link>

              <Link to="/wishlist">
                <FaHeart
                  className="text-xl text-red-500 cursor-pointer hover:scale-110 transition mt-1.5"
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
                      src={user.avatar}
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
                          user?.hostType === "admin" ||
                          user?.hostType === "owner"
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
          </div>
        </div>
        <div className="flex items-center font-semibold rounded-lg md:hidden justify-end mt-2">
          <h3 className="w-auto px-4   ">
            <span className="text-red-600 text-xl">
              ₹ {hotel?.pricePerNight}
            </span>
            /night
          </h3>
          <button
            className=" bg-red-500 md:w-full w-1/2 h-10 hover:bg-red-400 cursor-pointer text-white text-md rounded-lg"
            onClick={scrollToBooking}
          >
            Book Now
          </button>
        </div>
      </nav>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-bold">{hotel?.title}</h2>
          <div className="flex gap-4 text-gray-600 text-xl">
            <div className="relative">
              <WishlistIcon hotel={hotel} />
              <FaShareAlt
                className="absolute top-2.5 cursor-pointer"
                title="Share"
              />
            </div>
          </div>
        </div>

        {/* Location and rating */}
        <div className="flex items-center text-gray-600 space-x-4 text-lg">
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt />
            <span>
              {hotel.location?.city}/ {hotel.location?.state}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span>4.5</span>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1  md:grid-cols-2 gap-4 relative ">
          {hotel.images && hotel.images.length > 0 && (
            <>
              <img
                src={hotel.images[0]?.url || ""}
                alt={hotel.images[0]?.title || "loading..."}
                className="w-full h-full object-cover rounded p-4 "
              />
              <div className="grid grid-cols-4 md:grid-cols-2 md:grid-rows-2 gap-4 ">
                {hotel.images.slice(1, 5).map((img, index) => (
                  <img
                    key={index + 2}
                    src={img.url || ""}
                    alt={`Hotel view ${index + 2}` || "loading..."}
                    className="w-full md:h-48 object-cover rounded hover:scale-110 duration-300"
                  />
                ))}
                <button
                  className="w-auto px-2 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-2xl absolute right-1 bottom-1 md:right-4 md:bottom-4 "
                  onClick={() => setShowImage(true)}
                >
                  {" "}
                  5/10 View more
                </button>
              </div>
            </>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">About this place</h3>
          <p className="text-gray-700">{hotel.description}</p>
          <p className="mt-4 text-xl font-semibold">
            <span className=" font-semibold text-red-500 text-3xl mr-1">
              ₹{hotel.pricePerNight}
            </span>
            / night
          </p>
        </div>

        {/* Amenities */}
        <h3 className="text-2xl font-semibold ">What this place offers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 text-gray-700 mb-4">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-6">
                {amenity.icon}
                <span>{amenity.title}</span>
              </div>
            ))}
          </div>
          <div className="flex bold text-2xl text-white bg-gradient-to-tl from-blue-400 to-purple-600  items-center justify-center gap-6 w-full border-blue-400 border-2 h-full text-center">
            Advertisement section
          </div>
        </div>
        {/* Booking Form */}
        <BookingSection hotel={hotel} ref={bookingRef} />

        {/* Map Section */}
        <div className="border p-4 rounded shadow text-center">
          <h3 className="text-xl font-semibold mb-2">Explore Location</h3>
          <p className="text-gray-600 mb-4">
            {hotel.location?.city}/ {hotel.location?.state}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              hotel.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View on Map
          </a>
        </div>

        {/* Host Info */}
        <div className="border rounded p-4">
          <h3 className="text-xl font-semibold mb-2">Hosted by (Host name)</h3>
          <div className="flex items-center gap-2 mb-2">
            <FaUserCircle className="text-2xl text-gray-500" />
            <span>Host name</span>
          </div>
          <p className={`text-gray-700 ${!show ? " line-clamp-5" : ""}`}>
            (Host description) Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Tenetur in similique praesentium porro magnam
            debitis, dolore doloribus odio earum doloremque dicta, quasi
            consectetur id qui nesciunt omnis ipsa quae voluptate! Voluptatibus
            modi, commodi asperiores possimus dolores aliquid id similique et,
            quaerat dignissimos pariatur. Enim illo ea quos eius aliquid,
            reprehenderit quam quae, eos magni molestias sed, ipsa ipsam ullam
            quibusdam. Eveniet voluptate, impedit omnis quibusdam laboriosam
            nam. Magni soluta esse incidunt! Quis error sed dicta reiciendis!
            Voluptatem accusamus quidem deleniti et ipsa magnam ad perspiciatis,
            aspernatur cum, soluta, cupiditate exercitationem! Quas magnam quasi
            enim nihil sed placeat ipsum officia minus itaque cumque illum
            consequatur adipisci quo quibusdam nostrum tempora quos voluptates
            odit pariatur deserunt temporibus nulla veritatis, soluta atque.
            Accusantium. Odio quae deserunt ipsam. Quo nostrum voluptates sed
            sequi soluta, delectus velit commodi ullam quidem amet nam mollitia
            doloribus, porro eveniet eum illum! Officia reprehenderit, culpa
            voluptatibus inventore fuga quisquam?
          </p>
          <button
            className="text-blue-400"
            onClick={() => setShow((prev) => !prev)}
          >
            {!show ? " Show more" : "Show less"}
          </button>
        </div>

        {/* Reviews */}
        <section className="px-6 py-16 bg-white">
          <h3 className="text-3xl font-semibold text-center mb-10">
            What Our Guests Say
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-xl shadow">
                <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold">{review.name}</h4>
                  <div className="text-yellow-500 flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Similar Hotels */}
        <section>
          <div className="flex justify-between items-center mb-4 md:px-4 px-2 ">
            <h4 className="text-3xl font-semibold">
              More places near <br className="md:hidden" />{" "}
              {hotel.location?.city}, {hotel.location?.state}
            </h4>
            <div>
              <button
                onClick={() =>
                  (document.getElementById("similar").scrollLeft -= 500)
                }
                className="h-8 w-8 pb-1 mx-1 inline-flex justify-center items-center bg-white hover:bg-gray-100 shadow-lg rounded-full text-3xl"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  (document.getElementById("similar").scrollLeft += 500)
                }
                className="h-8 w-8 pb-1 inline-flex justify-center items-center bg-white hover:bg-gray-100 shadow-lg rounded-full text-3xl"
              >
                ›
              </button>
            </div>
          </div>
          <div
            id="similar"
            className="flex overflow-x-auto gap-4 scrollbar-hidden scroll-smooth px-10 py-4 cursor-grab select-none"
          >
            {similarHotels?.map((items, i) => (
              <div>
                <div
                  key={i}
                  className="min-w-[250px] bg-white rounded-xl shadow hover:shadow-md cursor-pointer relative"
                >
                  <div className="relative">
                    <img
                      src={hotel.images[1]?.url}
                      alt={hotel.title}
                      className="h-40 w-full object-contain rounded-t-xl"
                      onClick={() => navigate(`/listing/${hotel._id}`)}
                    />
                    <WishlistIcon hotel={items} />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-lg line-clamp-1 h-[2rem]">
                      {items.title}
                    </p>
                    <p className="text-gray-500 text-sm ">
                      {items.location.city}/ {items.location.state}
                    </p>
                    <p className="text-red-500 font-semibold mt-1 ">
                      ₹ {items.pricePerNight}/night
                    </p>

                    <button className="w-full h-auto py-1 mt-1 cursor-pointer bg-red-500 hover:bg-red-600 rounded-xl text-white text-lg">
                      Book now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default HotelProductPage;
