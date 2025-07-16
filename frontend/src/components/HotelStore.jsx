import React, { useEffect, useState } from "react";
import { FaStar, FaSearch, FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import listingService from "../backendConnect/listing";
import WishlistIcon from "./utils/WishlistIcon";
import { useNavigate } from "react-router-dom";

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
  const [priceRange, setPriceRange] = useState([1000, 10000]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [amenitiesFilter, setAmenitiesFilter] = useState([]);
  const [hotelResult, setHotelResult] = useState([]);
  const [searchQueryParams] = useSearchParams();
  const [location, setLocation] = useState(null);
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [newLocation, setNewLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [perPage, setPerPage] = useState(12);
  const [arrowDown, setArrowDown] = useState(true);
  const navigate = useNavigate();

  const getAllHotels = async () => {
    try {
      const response = await listingService.getAllItems(page, perPage);
      setHotelResult(response.listings);
      // console.log(hotelResult);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.log("searchbar error:", error.message);
    }
  };


  useEffect(() => {
    // Extract query params only once when component mounts
    const loc = searchQueryParams.get("location");
    const ci = searchQueryParams.get("checkin");
    const co = searchQueryParams.get("checkout");

    if (loc || ci || co) {
      setLocation(loc);
      setCheckin(ci);
      setCheckout(co);
    } else {
      getAllHotels(page, perPage);
    }
  }, [page, perPage]);

  useEffect(() => {
    const searchHotel = async () => {
      try {
        const response = await listingService.searchListings(
          location,
          checkin || null,
          checkout || null,
          page || 1,
          perPage || 12
        );
        setHotelResult(response.listings);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log("searchHotel error:", error.message);
      }
    };

    if (location || checkin || checkout) {
      searchHotel();
    }
  }, [location, checkin, checkout, page, perPage]);

  const handleAmenityChange = (amenity) => {
    setAmenitiesFilter((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filteredHotels = hotelResult?.filter((hotel) => {
    return (
      hotel.title.toLowerCase().includes(search.toLowerCase()) &&
      hotel.pricePerNight >= priceRange[0] &&
      hotel.pricePerNight <= priceRange[1]
      // (!selectedRating || hotel.rating >= selectedRating) &&
      // (!typeFilter || hotel.type === typeFilter) &&
      // amenitiesFilter.every((a) => hotel.amenities.includes(a))
    );
  });
  //  Page Change Button Component
  const pageChange = () => {
    return (
      <div className="inline-flex justify-end mb-4 px-4  ">
        <button
          onClick={() => {
            if (page > 1) setPage((prev) => prev - 1);
          }}
          className="h-10 w-10 pb-1 mx-1 justify-center items-center bg-white hover:bg-gray-100 shadow-lg rounded-full text-3xl"
        >
          ‹
        </button>
        <p className="m-1">- {page} -</p>
        <button
          onClick={() => {
            if (page < totalPages) setPage((prev) => prev + 1);
          }}
          className="h-10 w-10 pb-1 justify-center items-center bg-white hover:bg-gray-100 shadow-lg rounded-full text-3xl"
        >
          ›
        </button>
      </div>
    );
  };

  const filters = (className) => {
    return (
      <div
        className={`md:col-span-1 max-h-[32rem] space-y-4 bg-white p-4 rounded-xl shadow md:sticky top-14 z-40 ${
          arrowDown ? "hidden" : "block"
        } ${className}`}
      >
        <label className="text-xl font-medium flex items-center w-full ">
          <FaFilter className="text-red-600 inline-block w-6 h-6 mx-2" />{" "}
          Filters{" "}
        </label>
        <div className={`space-y-3.5`}>
          <label className="text-sm font-medium ">Items/ page</label>
          <div className={`flex items-center rounded-xl overflow-hidden mt-2 `}>
            <select
              value={perPage}
              onChange={(e) => setPerPage(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl "
            >
              <option value="" className="  text-center bg-blue-50 mb-2">
                12 (Default)
              </option>
              <option value="10" className=" text-center bg-blue-50 mb-2">
                10
              </option>
              <option value="15" className=" text-center bg-blue-50 mb-2">
                15
              </option>
              <option value="30" className=" text-center bg-blue-50 mb-2">
                30
              </option>
            </select>
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
                    checked={amenitiesFilter?.includes(a)}
                    onChange={() => handleAmenityChange(a)}
                  />
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen  ">
      {/* Searchbar */}
      <div
        className={`flex flex-col w-full py-2 px-2 justify-center items-center sticky top-0 z-50`}
      >
        <div className="flex bg-white shadow-md max-w-100 w-full rounded-xl md:absolute md:top-0 md:mt-2">
          <div
            className={`bg-red-100 py-2 md:hidden rounded-l-xl flex items-center ${
              arrowDown ? `shadow-xl` : `shadow-md`
            }`}
            onClick={() => setArrowDown((prev) => !prev)}
          >
            <FaFilter
              className={`text-red-600 inline-block w-7 h-7 mx-4 duration-100 ${
                arrowDown ? `scale-80` : ``
              }`}
            />{" "}
          </div>
          <input
            type="text"
            placeholder="Type the location here"
            required
            className="border-red-400 border-r-none p-3 w-full outline-0 focus:shadow-xl text-center "
            onChange={(e) => setNewLocation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setLocation(newLocation);
                setPage(1); // Trigger search manually
              }
            }}
          />
          <button
            className="bg-red-500 rounded-r-xl w-3/15 shadow-xl text-white px-2 py-2 flex items-center justify-center hover:bg-red-600 transition"
            onClick={() => {
              setLocation(newLocation);
              setPage(1);
            }}
          >
            <FaSearch />
          </button>
        </div>
        {filters("md:hidden mt-4")}
      </div>

      <div className="flex justify-between items-center text-xl md:text-2xl mb-4 mt-4 md:mt-10 text-end text-red-600">
        <p className="px-14 hidden md:block"></p>
        <span className="text-2xl md:text-3xl font-bold">Explore Hotels</span>
        {/* Page change buttons */}
        {pageChange()}
      </div>
      <div className={`flex flex-col md:grid md:grid-cols-4 gap-6 mb-8  `}>
        {/* Filters */}
        {filters("md:block hidden")}

        {/* Results */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels?.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No hotels match your filters.
            </p>
          ) : (
            filteredHotels?.map((hotel, i) => (
              <div className="w-full" key={hotel._id || i}>
                <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition">
                  <div className="relative">
                    <img
                      src={hotel?.images[1]?.url}
                      alt={hotel.title}
                      className="h-40 w-full object-cover rounded-t-xl"
                      onClick={() => navigate(`/listing/${hotel._id}`)}
                    />
                    <WishlistIcon hotel={hotel} />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {hotel.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {hotel.location.city}/ {hotel.location.state}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                      <FaStar /> 4.5
                    </div>
                    <p className="text-red-500 font-semibold mt-2">
                      ₹{hotel.pricePerNight}/night
                    </p>
                    <button
                      className="w-full mt-3 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                      onClick={() => navigate(`/listing/${hotel._id}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex-row-reverse items-center text-center z-80 text-xl text-red-500 ">
        {pageChange()}
      </div>
    </div>
  );
};

export default HotelStore;
