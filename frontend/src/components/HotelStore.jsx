import React, { useState } from "react";
import { FaStar, FaSearch } from "react-icons/fa";

const hotelsList = [
  {
    name: "Hotel Sunrise",
    location: "Goa",
    price: 2500,
    rating: 4.5,
    type: "Resort",
    amenities: ["wifi", "pool", "parking"],
    image: "https://source.unsplash.com/300x200/?hotel,beach",
  },
  {
    name: "City View Inn",
    location: "Mumbai",
    price: 1800,
    rating: 4.0,
    type: "Hotel",
    amenities: ["wifi", "parking"],
    image: "https://source.unsplash.com/300x200/?hotel,city",
  },
  // ...more sample hotels
];

const HotelStore = () => {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 5000]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [amenitiesFilter, setAmenitiesFilter] = useState([]);

  const handleAmenityChange = (amenity) => {
    setAmenitiesFilter((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filteredHotels = hotelsList.filter((hotel) => {
    return (
      hotel.name.toLowerCase().includes(search.toLowerCase()) &&
      hotel.price >= priceRange[0] &&
      hotel.price <= priceRange[1] &&
      (!selectedRating || hotel.rating >= selectedRating) &&
      (!typeFilter || hotel.type === typeFilter) &&
      amenitiesFilter.every((a) => hotel.amenities.includes(a))
    );
  });

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-red-600">
        Explore Hotels
      </h2>
      <div className="flex flex-col md:grid md:grid-cols-4 gap-6 mb-8">
        {/* Search & Filters */}
        <div className="md:col-span-1 space-y-4 bg-white p-4 rounded-xl shadow">
          <div>
            <label className="text-sm font-medium">Search</label>
            <div className="flex items-center border rounded-xl overflow-hidden mt-1">
              <input
                type="text"
                placeholder="Search hotels"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 outline-none"
              />
              <FaSearch className="mx-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Price Range</label>
            <div className="flex gap-2 mt-1 flex-col sm:flex-row">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([+e.target.value, priceRange[1]])
                }
                className="w-full px-3 py-2 border rounded-xl"
              />
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], +e.target.value])
                }
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Rating</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {[3, 4, 4.5, 5].map((r) => (
                <button
                  key={r}
                  className={`px-3 py-1 rounded-full text-sm border transition whitespace-nowrap ${
                    selectedRating === r
                      ? "bg-red-500 text-white"
                      : "text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedRating(r)}
                >
                  {r}+ <FaStar className="inline text-yellow-400 ml-1" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-xl"
            >
              <option value="">All Types</option>
              <option value="Hotel">Hotel</option>
              <option value="Resort">Resort</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Amenities</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["wifi", "pool", "parking", "ac", "breakfast"].map((a) => (
                <label key={a} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={amenitiesFilter.includes(a)}
                    onChange={() => handleAmenityChange(a)}
                  />
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No hotels match your filters.
            </p>
          ) : (
            filteredHotels.map((hotel, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition"
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-40 object-cover"
                />
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelStore;
