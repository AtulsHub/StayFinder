import React, { useEffect, useState } from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import wishlistService from "../backendConnect/wishlist";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyWishlist = () => {
  const userId = useSelector((state) => state.user?.userData?._id);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) fetchWishlist();
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist(userId);
      setWishlist(data.listings || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err.message);
    }
  };

  const toggleWishlist = async (hotelId) => {
    try {
      await wishlistService.removeFromWishlist(userId, hotelId);
      setWishlist((prev) => prev.filter((item) => item._id !== hotelId));
    } catch (err) {
      console.error("Error removing from wishlist:", err.message);
    }
  };

  const clearWishlist = async () => {
    try {
      await wishlistService.clearWishlist(userId);
      setWishlist([]);
    } catch (err) {
      console.error("Error clearing wishlist:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-4">
        My Wishlist
      </h2>

      {wishlist.length > 0 && (
        <div className="flex justify-center mb-6">
          <button
            onClick={clearWishlist}
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg">
            You have no hotels in your wishlist.
          </p>
        ) : (
          wishlist?.map((hotel, i) => (
            <div
              key={hotel._id || i}
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition relative"
            >
              <Link to={`/listing/${hotel._id}`}>
                <img
                  src={hotel.images?.[0]?.url}
                  alt={hotel.title}
                  className="w-full h-40 object-cover"
                />
              </Link>

              <FaHeart
                onClick={() => toggleWishlist(hotel._id)}
                className="absolute top-3 right-3 text-red-500 text-xl drop-shadow cursor-pointer hover:scale-110 transition"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold">{hotel.title}</h3>
                <p className="text-sm text-gray-500">
                  {hotel.location?.city}, {hotel.location?.state}
                </p>
                <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                  <FaStar /> {hotel.rating || "4.5"}
                </div>
                <p className="text-red-500 font-semibold mt-2">
                  ₹{hotel.pricePerNight}/night
                </p>
                <button className="w-full mt-3 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                onClick={() => navigate(`/listing/${hotel._id}`)}>
                  Book Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyWishlist;
