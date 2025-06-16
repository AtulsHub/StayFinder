import React from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const wishlist = [
  {
    name: "Beach Paradise Villa",
    location: "Goa",
    price: 3500,
    rating: 4.8,
    image: "https://source.unsplash.com/300x200/?villa,beach",
  },
  {
    name: "Urban Stay Hotel",
    location: "Mumbai",
    price: 2200,
    rating: 4.3,
    image: "https://source.unsplash.com/300x200/?hotel,room",
  },
  // Add more wishlisted hotels
];

const MyWishlist = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
        My Wishlist
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            You have no hotels in your wishlist.
          </p>
        ) : (
          wishlist.map((hotel, i) => (
           <Link to="/listing">
             <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition relative"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-40 object-cover"
              />
              <FaHeart className="absolute top-3 right-3 text-red-500 text-xl drop-shadow" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{hotel.name}</h3>
                <p className="text-sm text-gray-500">{hotel.location}</p>
                <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                  <FaStar /> {hotel.rating}
                </div>
                <p className="text-red-500 font-semibold mt-2">
                  ₹{hotel.price}/night
                </p>
                <button className="w-full mt-3 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600">
                  Book Now
                </button>
              </div>
            </div>
           </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MyWishlist;
