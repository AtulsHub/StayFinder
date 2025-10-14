import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp,
  Calendar,
  IndianRupee,
  Users,
  Home,
  BarChart3,
  Clock,
  CheckCircle,
} from 'lucide-react';
import listingService from '../../backendConnect/listing';
import bookingService from '../../backendConnect/booking';

const OwnerAnalytics = () => {
  const [listings, setListings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = useSelector((state) => state.user?.userData?._id);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      setLoading(true);
      setError('');

      try {
        // Fetch user's listings
        const listingsRes = await listingService.getListingsByUserId(userId);
        const userListings = listingsRes.data || [];
        setListings(userListings);

        // Fetch bookings for all listings
        const bookingsPromises = userListings.map((listing) =>
          bookingService.getBookingsByListing(listing._id).catch(() => ({ bookings: [] }))
        );
        const bookingsResults = await Promise.all(bookingsPromises);
        const allBookingsData = bookingsResults.flatMap((res) => res.bookings || []);
        setAllBookings(allBookingsData);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600">Loading analytics...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  // Calculate analytics
  const totalListings = listings.length;
  const totalBookings = allBookings.length;
  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  // Bookings by month (last 6 months)
  const now = new Date();
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const bookingsInMonth = allBookings.filter((b) => {
      const bookingDate = new Date(b.checkIn);
      return (
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
    const revenue = bookingsInMonth.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    monthlyData.push({
      month: monthName,
      bookings: bookingsInMonth.length,
      revenue,
    });
  }

  // Top performing listings
  const listingPerformance = listings.map((listing) => {
    const listingBookings = allBookings.filter(
      (b) => b.listing?._id === listing._id || b.listing === listing._id
    );
    const revenue = listingBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return {
      ...listing,
      bookingsCount: listingBookings.length,
      revenue,
    };
  });
  const topListings = listingPerformance
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Recent bookings
  const recentBookings = [...allBookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const maxMonthlyRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analytics Overview</h2>
        <p className="text-gray-600">Track your business performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <IndianRupee className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{totalBookings}</p>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Listings</p>
              <p className="text-2xl font-semibold text-gray-900">{totalListings}</p>
            </div>
            <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
              <Home className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Booking Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{Math.round(averageBookingValue).toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-red-500" />
          Revenue Trend (Last 6 Months)
        </h3>
        <div className="space-y-4">
          {monthlyData.map((data, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{data.month}</span>
                <span className="text-sm text-gray-600">
                  ₹{data.revenue.toLocaleString()} ({data.bookings} bookings)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(data.revenue / maxMonthlyRevenue) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Listings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Top Performing Listings
          </h3>
          {topListings.length > 0 ? (
            <div className="space-y-3">
              {topListings.map((listing, index) => (
                <div
                  key={listing._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {listing.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {listing.bookingsCount} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      ₹{listing.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No booking data available yet
            </p>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Recent Bookings
          </h3>
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.listing?.title || 'Listing'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.user?.name || booking.user?.email || 'Guest'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(booking.checkIn).toLocaleDateString()} -{' '}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{booking.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent bookings
            </p>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Occupancy Rate</p>
            <p className="text-2xl font-bold text-red-600">
              {totalListings > 0
                ? Math.round((totalBookings / (totalListings * 30)) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-gray-500 mt-1">Based on 30-day average</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Revenue per Listing</p>
            <p className="text-2xl font-bold text-red-600">
              ₹{totalListings > 0 ? Math.round(totalRevenue / totalListings).toLocaleString() : 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Average across all properties</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Growth Trend</p>
            <p className="text-2xl font-bold text-green-600 flex items-center">
              <TrendingUp className="h-6 w-6 mr-1" />
              {monthlyData.length >= 2 &&
              monthlyData[monthlyData.length - 1].revenue > monthlyData[monthlyData.length - 2].revenue
                ? '↑'
                : '→'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Compared to last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerAnalytics;
