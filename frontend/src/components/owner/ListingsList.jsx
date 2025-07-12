
import React from 'react';
import { Edit, Trash2, Eye, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { EditListingForm } from './EditListingForm';

// export const ListingsList = ({ listings, onEdit, onDelete }) => {
    export const ListingsList = ({  onDelete }) => {

const listings = [
    {
      _id: '1',
      title: 'Luxury Villa in Goa',
      location: { city: 'Panaji', district: 'North Goa', state: 'Goa', pincode: '403001' },
      pricePerNight: 15000,
      host: { name: 'John Doe', email: 'john@example.com' },
      status: 'active',
      totalBookings: 24,
      rating: 4.8,
      images: [{ url: '/api/placeholder/300/200', title: 'Main view' }]
    },
    {
      _id: '2',
      title: 'Beach House Mumbai',
      location: { city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', pincode: '400001' },
      pricePerNight: 12500,
      host: { name: 'Jane Smith', email: 'jane@example.com' },
      status: 'active',
      totalBookings: 18,
      rating: 4.6,
      images: [{ url: '/api/placeholder/300/200', title: 'Beach view' }]
    },
    {
      _id: '3',
      title: 'Mountain Resort Shimla',
      location: { city: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh', pincode: '171001' },
      pricePerNight: 8900,
      host: { name: 'Mike Johnson', email: 'mike@example.com' },
      status: 'inactive',
      totalBookings: 12,
      rating: 4.4,
      images: [{ url: '/api/placeholder/300/200', title: 'Mountain view' }]
    }
  ];

  const handleDelete = (listing) => {
    if (window.confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      onDelete(listing._id);
    }
  };
  const onEdit = (listing) => {
    return <EditListingForm/>
  }

  if (listings?.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
        <p className="text-gray-600 mb-4">Get started by creating your first property listing.</p>
        <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          Add Your First Listing
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">My Listings</h2>
        <span className="text-sm text-gray-600">{listings.length} listings total</span>
      </div>

      <div className="grid gap-6">
        {listings.map((listing) => (
          <div key={listing._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex">
              {/* Image */}
              <div className="w-64 h-48 flex-shrink-0">
                {listing.images.length > 0 ? (
                  <img
                    src={listing.images[0].url}
                    alt={listing.images[0].title}
                    className="w-full h-full object-cover"
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{listing.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {listing.location.city}, {listing.location.district}, {listing.location.state}
                      </span>
                    </div>
                    <div className="flex items-center text-red-600 font-semibold">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <span>{listing.pricePerNight.toLocaleString()} per night</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {return <EditListingForm/>}}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit listing"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(listing)}
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
                      <Calendar className="h-4 w-4 mr-1" />
                      {/* <span>{listing.availableDates.length} date ranges</span> */}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{listing.images.length} photos</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      listing.bookedSlots.length > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}> */}
                      {/* {listing.bookedSlots.length > 0 ? 'Has Bookings' : 'Available'} */}
                    {/* </span> */}
                    <span className="text-xs text-gray-500">
                      Updated {new Date(listing.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
