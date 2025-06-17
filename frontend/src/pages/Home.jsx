import React, { useEffect } from "react";
import PropertyList from "../components/PopularListing";
import { useSelector } from "react-redux";
import { useState } from "react";
import SearchByPopularPlaces from "../components/SearchByPopularPlaces";

import {
  FaSearch,
  FaUserCircle,
  FaWifi,
  FaParking,
  FaSwimmer,
  FaUtensils,
  FaSpa,
  FaStar,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PopularListing from "../components/PopularListing";

export const hotels = Array.from({ length: 10 }, (_, i) => ({
  name: `Hotel ${i + 1}`,
  image: `https://source.unsplash.com/featured/?hotel,room,${i}`,
  location: `City ${i + 1}, India`,
  price: `₹${3000 + i * 500}/night`,
}));


const facilities = [
  {
    icon: <FaWifi />,
    label: "Free WiFi",
    desc: "Stay connected with high-speed internet.",
  },
  {
    icon: <FaParking />,
    label: "Free Parking",
    desc: "Secure parking space for your vehicle.",
  },
  {
    icon: <FaSwimmer />,
    label: "Swimming Pool",
    desc: "Relax and refresh in our clean pool.",
  },
  {
    icon: <FaUtensils />,
    label: "Restaurant",
    desc: "Tasty meals from local and international cuisines.",
  },
  {
    icon: <FaSpa />,
    label: "Spa & Wellness",
    desc: "Rejuvenate your body and mind.",
  },
];

export const reviews = [
  {
    name: "Aarav Shah",
    comment:
      "Amazing stay! The view was spectacular and the service was top-notch.",
    rating: 5,
  },
  {
    name: "Riya Mehta",
    comment: "Comfortable rooms and great amenities. Highly recommended!",
    rating: 4,
  },
];

export default function LandingPage() {
  return (
    <div className="font-sans bg-white text-gray-800">
      {/* Navbar */}
      <Navbar />
      {/* Hero */}
      <section
        className="relative h-[85vh] bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://source.unsplash.com/featured/?hotel,resort)",
        }}
      >
        <div className="bg-black bg-opacity-60 w-full h-full absolute" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center text-white z-10 px-4"
        >
          <h2 className="text-4xl md:text-6xl font-bold">
            Book Your Dream Stay
          </h2>
          <p className="text-lg mt-4 max-w-xl mx-auto">
            Unique hotels and stays around the world. Find comfort, style and
            convenience wherever you go.
          </p>
        </motion.div>
      </section>
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-6 bg-white shadow-lg mx-6 rounded-xl -mt-16 relative">
        <input
          type="text"
          placeholder="Location"
          className="border p-3 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-red-400"
        />
        <input
          type="date"
          className="border p-3 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-red-400"
        />
        <input
          type="number"
          placeholder="Guests"
          className="border p-3 rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-red-400"
        />
        <button className="bg-red-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-red-600 transition">
          <FaSearch /> Search
        </button>
      </div>
      {/* 1. Popular Listings */}
      <PopularListing />
      {/* 2. Search by Popular Places */}
      <SearchByPopularPlaces />
      {/* 3. Facilities We Offer */}
      <section className="py-16 px-6 bg-white text-center">
        <h3 className="text-3xl font-semibold mb-10">Facilities We Offer</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          {facilities.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="text-3xl text-red-500 mb-3">{item.icon}</div>
              <h4 className="font-semibold">{item.label}</h4>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* 4. Quotes */}
      <section className="px-6 py-16 bg-gray-100 text-center">
        <h3 className="text-3xl font-semibold mb-6">Traveler's Thought</h3>
        <blockquote className="italic text-lg text-gray-700 max-w-2xl mx-auto">
          "Travel is the only thing you buy that makes you richer."
        </blockquote>
      </section>
      {/* 5. Reviews */}
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
      {/* 6. Footer Section */}
      <section className="px-6 pt-16 py-4 bg-gray-100 text-center">
        <h3 className="text-3xl font-bold mb-6 text-gray-800">
          About StayFinder
        </h3>
        <p className="max-w-3xl mx-auto text-gray-600 text-lg">
          StayFinder is your trusted platform for discovering exceptional stays
          across India. We are committed to delivering seamless hotel booking
          experiences with transparency, comfort, and ease.
        </p>

        <div className="mt-10 space-y-2 text-sm text-gray-600">
          <p className="flex justify-center items-center gap-2">
            <FaEnvelope /> support@stayfinder.com
          </p>
          <p className="flex justify-center items-center gap-2">
            <FaPhone /> +91-99999-99999
          </p>
          <p>123 Travel Lane, Wanderlust City, India</p>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-gray-600 text-xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-800"
          >
            <FaLinkedinIn />
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
