
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  MapPin,
  Star
} from 'lucide-react';

const ListingsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data based on your schema
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

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || listing.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Listings Management</h2>
        <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Add New Listing
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div key={listing._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="relative">
              <img
                src={listing.images[0]?.url}
                alt={listing.images[0]?.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {listing.status}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {listing.location.city}, {listing.location.state}
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{listing.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({listing.totalBookings} bookings)</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ₹{listing.pricePerNight.toLocaleString()}/night
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                Host: {listing.host.name}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm">
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new listing.</p>
        </div>
      )}
    </div>
  );
};

export default ListingsManagement;
