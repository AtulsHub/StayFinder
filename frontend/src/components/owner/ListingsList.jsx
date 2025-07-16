import React, { useEffect, useState } from "react";
import { Edit, Trash2, Eye, MapPin, Calendar, IndianRupee } from "lucide-react";
import { useSelector } from "react-redux";
import listingService from "../../backendConnect/listing";
import ConfirmModal from "../utils/ConfirmModel";
import EditListingForm from "./EditListingForm";
import { useNavigate } from "react-router-dom";

const ListingsList = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const userId = useSelector((state) => state.user.userData._id);

  useEffect(() => {
    if (!userId) return;

    const fetchListings = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await listingService.getListingsByUserId(userId);
        setListings(res.data || []); // assuming API returns { data: [] }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  const handleSave = async (updatedListing) => {
    try {
      setSaving(true);
      await listingService.updateListing(updatedListing._id, updatedListing);
      setEditingListing(null);
      // reload listings
      const data = await listingService.getListingsByUserId(userId);
      setListings(data.data);
      setSaving(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save listing.");
      setSaving(false);
    }
  };

  const confirmDelete = (listing) => {
    setSelectedListing(listing);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedListing) return;

    try {
      await listingService.deleteListing(selectedListing._id);
      setListings((prev) => prev.filter((l) => l._id !== selectedListing._id));
    } catch (err) {
      console.error("Failed to delete listing", err);
    } finally {
      setConfirmOpen(false);
      setSelectedListing(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-8">Loading listings...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  if (!listings.length) {
    return (
      <div className="text-center text-gray-600 py-8">
        No listings found for your account.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800">
        My Listings ({listings.length})
      </h2>

      {listings.map((listing) => (
        <div
          key={listing._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden px-4 "
        >
          <div className="flex">
            {/* Image */}
            <div className="w-64 h-48 flex-shrink-0">
              {listing.images?.length > 0 ? (
                <img
                  src={listing.images[0].url}
                  alt={listing.images[0].title}
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => navigate(`/listing/${listing._id}`)}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {listing.location?.district}, {listing.location?.state}
                    </span>
                  </div>
                  <div className="flex items-center text-red-600 font-semibold">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    <span>
                      {listing.pricePerNight.toLocaleString()} per night
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {/* 🆕 View Bookings */}
                  <button
                    onClick={() =>
                      navigate(`/owner/booking/${listing._id}`)
                    }
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View Bookings"
                  >
                    <Calendar className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setEditingListing(listing)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit listing"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {editingListing && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                      <div className="bg-white rounded shadow-lg p-4 w-full max-w-screen max-h-[90vh] overflow-y-auto">
                        <EditListingForm
                          listing={editingListing}
                          onSave={handleSave}
                          onCancel={() => setEditingListing(null)}
                          status={saving}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => confirmDelete(listing)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {listing.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{listing.images?.length || 0} photos</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Updated{" "}
                  {listing.updatedAt
                    ? new Date(listing.updatedAt).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Listing"
        message={`Are you sure you want to delete "${selectedListing?.title}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
      />
    </div>
  );
};

export default ListingsList;
