import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import listingService from "../backendConnect/listing";
import wishlistService from "../backendConnect/wishlist";
import { useSelector } from "react-redux"; // for userId
import WishlistIcon from "./utils/WishlistIcon";
import Loader from "../pages/Loader";

const PopularListing = () => {
  const [popularHotels, setPopularHotels] = useState({});
  const places = ["Goa", "Manali", "Mumbai", "Jaipur", "Kerala"];
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user?.userData?._id); // update based on your user slice
  console.log("userId:", userId);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) fetchWishlist();
  }, [userId]);

  const fetchWishlist = async () => {

    try {
      const data = await wishlistService.getWishlist(userId);
      console.log("Wishlist data:", data);

      // Case 1: data.listings = [id, id, id]
      setWishlist(data.listings || []);

      // Case 2: if it returns objects with _id, then map:
      // setWishlist((data.listings || []).map((item) => item._id));
    } catch (err) {
      console.error("Error fetching wishlist:", err.message);
    }
  };

  useEffect(() => {
    const fetchAllListings = async () => {
          setIsLoading((prev) => !prev);

      const result = {};
      for (const place of places) {
        try {
          const response = await listingService.searchListings(
            place,
            null,
            null,
            1,
            2
          );
          result[place] = response.listings;
          console.log("response", response.listings);
        } catch (error) {
          console.log(`Error loading listings for ${place}:`, error);
          result[place] = [];
        }
      }
      setPopularHotels(result);
      console.log(popularHotels);
      setIsLoading((prev) => !prev);
    };

    fetchAllListings();
  }, []);
  console.log(popularHotels);

  const toggleWishlist = async (hotelId) => {
    console.log("Toggle wishlist for hotelId:", hotelId);

    try {
      const isWishlisted = wishlist.some((hotel) => hotel._id === hotelId);

      if (isWishlisted) {
        await wishlistService.removeFromWishlist(userId, hotelId);
      } else {
        await wishlistService.addToWishlist(userId, hotelId);
      }

      fetchWishlist(); // refresh list
    } catch (err) {
      console.error("Wishlist toggle error:", err.message);
    }
  };

  return (
    <div className="px-6 py-16 bg-gray-50">
      <h3 className="text-3xl font-semibold mb-8 text-center">
        Popular Listings
      </h3>
      <div className="flex justify-end mb-4 px-4 ">
        <button
          onClick={() =>
            (document.getElementById("popular-list").scrollLeft -= 500)
          }
          className="h-8 w-8 pb-1 mx-1 inline-flex justify-center items-center bg-white hover:bg-gray-100 shadow-lg rounded-full text-3xl"
        >
          ‹
        </button>
        <button
          onClick={() =>
            (document.getElementById("popular-list").scrollLeft += 500)
          }
          className="h-8 w-8 pb-1 inline-flex justify-center items-center bg-white hover:bg-gray-100 shadow-lg rounded-full text-3xl"
        >
          ›
        </button>
      </div>
      <div
        id="popular-list"
        className="flex overflow-x-auto gap-6 scrollbar-hidden scroll-smooth px-10 py-4"
      >
        {places.map((place) =>
          popularHotels[place]?.map((hotel, idx) => (
            <div key={hotel._id || idx}>
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="min-w-[250px] bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative"
              >
                {/* <img
                  src={hotel.images[0].url}
                  alt={hotel.title}
                  className="h-55 w-full object-cover"
                /> */}
                <div className="relative">
                  <img
                    src={hotel.images[0].url}
                    alt={hotel.title}
                    onClick={() => navigate(`/listing/${hotel._id}`)}
                  />
                  <WishlistIcon hotel={hotel} />
                </div>

                <div className="p-5">
                  <h4 className="text-xl font-bold text-gray-800 line-clamp-1">
                    {hotel.title}
                  </h4>
                  <p className="text-gray-500 text-sm mt-1">
                    {hotel.location?.city}/ {hotel.location?.state}
                  </p>
                  <p className="text-red-500 font-semibold mt-1">
                    ₹ {hotel.pricePerNight}/night
                  </p>
                  <button
                    className="w-full h-auto py-1 mt-1 cursor-pointer bg-red-500 hover:bg-red-600 rounded-xl text-white text-lg"
                    onClick={() => navigate(`/listing/${hotel._id}`)}
                  >
                    Book now
                  </button>
                </div>
              </motion.div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PopularListing;
