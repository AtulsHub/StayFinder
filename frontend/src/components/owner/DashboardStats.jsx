
import React from 'react';
import { TrendingUp, Calendar, IndianRupee, Eye, MapPin } from 'lucide-react';

export const DashboardStats = ({ listings }) => {
  const totalListings = listings.length;
  const totalBookings = listings.reduce((sum, listing) => sum + listing.bookedSlots.length, 0);
  const totalRevenue = listings.reduce((sum, listing) => {
    return sum + (listing.bookedSlots.length * listing.pricePerNight);
  }, 0);
  const averagePrice = listings.length > 0 
    ? listings.reduce((sum, listing) => sum + listing.pricePerNight, 0) / listings.length 
    : 0;

  const recentListings = listings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Listings',
      value: totalListings,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Average Price',
      value: `₹${Math.round(averagePrice).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Listings */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Listings</h3>
        
        {recentListings.length === 0 ? (
          <div className="text-center py-8">
            <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No listings yet. Create your first listing to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentListings.map((listing) => (
              <div key={listing._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  {listing.images.length > 0 ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.images[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{listing.title}</h4>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{listing.location.city}, {listing.location.state}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₹{listing.pricePerNight.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">per night</p>
                </div>
                
                <div className="text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    listing.bookedSlots.length > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.bookedSlots.length > 0 ? 'Booked' : 'Available'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-center">
            <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add New Listing</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-center">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Manage Bookings</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-center">
            <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">View Analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
};
