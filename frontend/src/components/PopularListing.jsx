import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { hotels } from "../pages/Home";

const PopularListing = () => (
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
      {hotels.map((hotel, idx) => (
        <Link to="/listing">
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            className="min-w-[250px] bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative"
          >
            <img
              src={hotel.image}
              alt={hotel.name}
              className="h-55 w-full object-cover"
            />
            <FaHeart
              className="absolute top-3 right-3 text-white text-xl drop-shadow cursor-pointer hover:scale-110 transition-transform"
              title="Add to Wishlist"
            />
            <div className="p-5">
              <h4 className="text-xl font-bold text-gray-800">{hotel.name}</h4>
              <p className="text-gray-500 text-sm mt-1">{hotel.location}</p>
              <p className="text-red-500 font-semibold mt-1">{hotel.price}</p>
              <button className="w-full h-auto py-1 mt-1 cursor-pointer bg-red-500 hover:bg-red-600 rounded-xl text-white text-lg">
                Book now
              </button>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  </div>
);

export default PopularListing;
