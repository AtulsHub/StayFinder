import React from "react";
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
} from "react-icons/fa";
import { reviews } from "../pages/Home";
import { hotels } from "../pages/Home";
import { Link } from "react-router-dom";
import SearchByPopularPlaces from "./SearchByPopularPlaces";

const HotelProductPage = () => {
  const hotel = {
    name: "The Royal Orchid",
    location: "Jaipur, Rajasthan",
    rating: 4.5,
    pricePerNight: 4999,
    description:
      "Experience luxury at The Royal Orchid, a 5-star hotel offering premium rooms, rooftop dining, and a relaxing spa in the heart of Jaipur.",
    images: ["/hotel1.jpg", "/hotel2.jpg", "/hotel3.jpg", "/hotel4.jpg"],
    amenities: ["Free WiFi", "Swimming Pool", "Free Parking", "Restaurant"],
    host: {
      name: "Ravi Sharma",
      about:
        "Ravi is a passionate hotelier with over 15 years of experience in the hospitality industry. His goal is to make your stay comfortable and memorable.",
    },
  };

  const similarHotels = [
    {
      name: "Heritage Haveli",
      location: "Jaipur",
      price: 3999,
      image: "/similar1.jpg",
    },
    {
      name: "Palace View Inn",
      location: "Jaipur",
      price: 4499,
      image: "/similar2.jpg",
    },
  ];

  const amenitiesIcons = {
    "Free WiFi": <FaWifi className=" w-6 h-6" />,
    "Swimming Pool": <FaSwimmer className=" w-6 h-6" />,
    "Free Parking": <FaParking className=" w-6 h-6" />,
    Restaurant: <FaUtensils className=" w-6 h-6" />,
  };

  return (
    <>
      {/* Navbar */}

      <nav className="flex justify-between items-center md:px-6 px-2 py-3 bg-white shadow-md sticky top-0 z-50">
        <Link to="/">
          <h1 className="text-2xl font-bold text-red-500">StayFinder</h1>
        </Link>
        <div className="flex flex-col-reverse md:flex-row justify-around items-center gap-3 ">
          <div className="flex items-center font-semibold rounded-lg mx-6">
            <h3 className="w-50  ">
              <span className="text-red-600 text-xl">
                ₹ {hotel.pricePerNight}
              </span>
              /night
            </h3>
            <button className=" bg-red-500 w-full h-10 hover:bg-red-400 cursor-pointer text-white text-md rounded-lg">
              Book Now
            </button>
          </div>
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
        </div>
      </nav>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">{hotel.name}</h2>
          <div className="flex gap-4 text-gray-600 text-xl">
            <FaHeart className="cursor-pointer" title="Add to Wishlist" />
            <FaShareAlt className="cursor-pointer" title="Share" />
          </div>
        </div>

        {/* Location and rating */}
        <div className="flex items-center text-gray-600 space-x-4 text-sm">
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt />
            <span>{hotel.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span>{hotel.rating}</span>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1  md:grid-cols-2 gap-4 relative ">
          <img
            src={hotel.images[1]}
            alt={`Hotel view 1`}
            className="w-full min-h-48 object-cover rounded border-1"
          />
          <div className="grid grid-cols-4 md:grid-cols-2 md:grid-rows-2  gap-4 ">
            {hotel.images.map((img, index) => (
              <img
                key={index + 2}
                src={img[index]}
                alt={`Hotel view ${index + 2}`}
                className="w-full md:h-48 object-cover rounded border-1"
              />
            ))}
            <p className="w-auto px-2 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-2xl absolute right-1 bottom-1 md:right-4 md:bottom-4 ">
              {" "}
              5/10 View more
            </p>
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 text-gray-700 mb-4">
            {hotel.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-6">
                {amenitiesIcons[amenity]}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
          {/* Booking & Map */}
          <div className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Book Your Stay</h3>
            <p className="text-gray-700 mb-2">
              Price per night:{" "}
              <span className="text-lg text-red-500 font-semibold">
                ₹{hotel.pricePerNight}
              </span>
            </p>
            <div className="space-y-4">
              <input
                type="date"
                className="w-full border rounded p-2"
                placeholder="Check-in"
              />
              <input
                type="date"
                className="w-full border rounded p-2"
                placeholder="Check-out"
              />
              <button className="w-full bg-red-500 text-white rounded py-2 hover:bg-red-400 cursor-pointer">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="border p-4 rounded shadow text-center">
          <h3 className="text-xl font-semibold mb-2">Explore Location</h3>
          <p className="text-gray-600 mb-4">{hotel.location}</p>
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
          <h3 className="text-xl font-semibold mb-2">
            Hosted by {hotel.host.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <FaUserCircle className="text-2xl text-gray-500" />
            <span>{hotel.host.name}</span>
          </div>
          <p className="text-gray-700">{hotel.host.about}</p>
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
              More places near <br className="md:hidden" /> {hotel.location}
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
            {hotels.map((items, i) => (
              <Link to="/listing">
                <div
                key={i}
                className="min-w-[250px] bg-white rounded-xl shadow hover:shadow-md cursor-pointer relative"
              >
                <img
                  src={items.image}
                  alt={items.name}
                  className="h-40 w-full object-cover rounded-t-xl"
                />
                <FaHeart
                  className="absolute top-3 right-3 text-white text-xl drop-shadow cursor-pointer hover:scale-110 transition-transform"
                  title="Add to Wishlist"
                />
                <div className="p-3">
                  <p className="font-semibold text-lg">{items.name}</p>
                  <p className="text-gray-500 text-sm ">{items.location}</p>
                  <p className="text-red-500 font-semibold mt-1 "></p>
                  {items.price}
                  <button className="w-full h-auto py-1 mt-1 cursor-pointer bg-red-500 hover:bg-red-600 rounded-xl text-white text-lg">
                    Book now
                  </button>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      
    </>
  );
};

export default HotelProductPage;
