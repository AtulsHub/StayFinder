import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import listingService from "../../backendConnect/listing.js";
import BookingCalendar from "../BookingSection.jsx";

const isPast = (endDate) => {
  const now = new Date();
  return new Date(endDate) < now;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

const OwnerBookingsView = () => {
  const { listingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await listingService.getListingById(listingId);
        setListing(res.item);
        // console.log(res.item);
      } catch (err) {
        // console.log(err);
        setError("Failed to fetch listing.");
      } finally {
        setLoading(false);
      }
    };

    if (listingId) fetchListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading bookings…</div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center py-8 text-red-600">
        {error || "Listing not found"}
      </div>
    );
  }

  const bookings = listing.bookings || [];

  const pastBookings = bookings.filter((b) => isPast(b.endDate));
  const upcomingBookings = bookings.filter((b) => !isPast(b.endDate));

  // map your bookings into the format BookingCalendar expects
  const bookedSlots = bookings.map((b) => ({
    startDateTime: b.startDate,
    endDateTime: b.endDate,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: Bookings list */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          Bookings for <span className="text-red-500">{listing.title}</span>
        </h2>

        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-1">Upcoming</h3>
          <div className="bg-white rounded shadow p-2 space-y-2">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="p-2 rounded cursor-pointer hover:bg-gray-100 flex justify-between"
                >
                  <div>
                    <div className="font-medium">{b.user}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No upcoming bookings</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-1">Past</h3>
          <div className="bg-white rounded shadow p-2 space-y-2">
            {pastBookings.length > 0 ? (
              pastBookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="p-2 rounded cursor-pointer hover:bg-gray-100 flex justify-between"
                >
                  <div>
                    <div className="font-medium">{b.user}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(b.startDate)} → {formatDate(b.endDate)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No past bookings</p>
            )}
          </div>
        </div>
      </div>

      {/* Right: Booking Calendar */}
      <div>
        <BookingCalendar hotel={{ bookedSlots }} hideInput="true" />
      </div>
    </div>
  );
};

export default OwnerBookingsView;
