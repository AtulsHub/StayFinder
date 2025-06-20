import React, { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import listingService from "../backendConnect/listing";
import Loader from "../pages/Loader";
import WishlistIcon from "./WishlistIcon";
import { useNavigate } from "react-router-dom";

const SearchByPopularPlaces = () => {
  const scrollRefs = useRef([]);
  const [hotelsByPlace, setHotelsByPlace] = useState({});
  const places = ["Goa", "Manali", "Mumbai", "Jaipur", "Kerala"];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllListings = async () => {
      const result = {};
      for (const place of places) {
        try {
          const response = await listingService.searchListings(
            place,
            null,
            null,
            1,
            10
          );
          result[place] = response.listings;
        } catch (error) {
          console.log(`Error loading listings for ${place}:`, error);
          result[place] = [];
        }
      }
      setHotelsByPlace(result);
      console.log(result);
    };

    fetchAllListings();
  }, []);

  // Drag logic
  const handleMouseDown = (idx, e) => {
    const container = scrollRefs.current[idx];
    container.isDown = true;
    container.startX = e.pageX - container.offsetLeft;
    container.scrollLeftStart = container.scrollLeft;
    container.classList.add("cursor-grabbing");
  };

  const handleMouseLeaveOrUp = (idx) => {
    const container = scrollRefs.current[idx];
    container.isDown = false;
    container.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (idx, e) => {
    const container = scrollRefs.current[idx];
    if (!container.isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - container.startX) * 1; // scroll speed
    container.scrollLeft = container.scrollLeftStart - walk;
  };

  return (
    <section className="py-14 px-6 bg-gray-100">
      <h3 className="text-3xl font-semibold text-center mb-8">
        Search by Popular Places
      </h3>
      <div className="space-y-12">
        {places.map((place, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center mb-4 px-4 ">
              <h4 className="text-2xl font-semibold">{place}</h4>
              <div>
                <button
                  onClick={() => (scrollRefs.current[idx].scrollLeft -= 500)}
                  className="h-8 w-8 pb-1 mx-1 inline-flex justify-center items-center bg-white hover:bg-gray-100 shadow-lg rounded-full text-3xl"
                >
                  ‹
                </button>
                <button
                  onClick={() => (scrollRefs.current[idx].scrollLeft += 500)}
                  className="h-8 w-8 pb-1 inline-flex justify-center items-center bg-white hover:bg-gray-100 shadow-lg rounded-full text-3xl"
                >
                  ›
                </button>
              </div>
            </div>
            <div
              ref={(el) => (scrollRefs.current[idx] = el)}
              onMouseDown={(e) => handleMouseDown(idx, e)}
              onMouseUp={() => handleMouseLeaveOrUp(idx)}
              onMouseLeave={() => handleMouseLeaveOrUp(idx)}
              onMouseMove={(e) => handleMouseMove(idx, e)}
              className="flex overflow-x-auto gap-4 py-2 scrollbar-hidden scroll-smooth px-8 cursor-grab select-none"
              style={{ scrollBehavior: "smooth" }}
            >
              {hotelsByPlace[place]?.length === 0 ? (
                <p className="text-center ext-xl col-span-full text-gray-500">
                  Loading ...
                </p>
              ) : (
                hotelsByPlace[place]?.map((hotel, i) => (
                  <div key={hotel._id || i}>
                    <div
                      key={i}
                      className="min-w-[250px] bg-white rounded-xl shadow hover:shadow-md cursor-pointer relative"
                    >
                      {/* <img
                        src={hotel.images[0].url}
                        alt={hotel.title}
                        className="h-40 w-full object-cover rounded-t-xl"
                      /> */}
                      <div className="relative">
                        <img src={hotel.images[0].url} alt={hotel.title} 
                        onClick={() => navigate(`/listing/${hotel._id}`)}/>
                        <WishlistIcon hotel={hotel} />
                      </div>

                      <div className="p-3">
                        <p className="font-semibold text-lg line-clamp-1 h-[2rem]">
                          {hotel.title}
                        </p>
                        <p className="text-gray-500 text-sm ">
                          {hotel.location.city}, {hotel.location.state}
                        </p>
                        <p className="text-red-500 font-semibold mt-1 ">
                          ₹ {hotel.pricePerNight}/night
                        </p>

                        <button className="w-full h-auto py-1 mt-1 cursor-pointer bg-red-500 hover:bg-red-600 rounded-xl text-white text-lg"
                        onClick={() => navigate(`/listing/${hotel._id}`)}>
                          Book now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SearchByPopularPlaces;
