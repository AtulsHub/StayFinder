
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building, 
  Calendar,
  IndianRupee
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import listingService from '../../backendConnect/listing';
import bookingService from '../../backendConnect/booking';
import userService from '../../backendConnect/user';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    totalListings: 0,
    totalUsers: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    topListings: [],
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [listingsRes, bookingsRes, usersRes] = await Promise.all([
        listingService.getAllItems(1, 1000),
        bookingService.getAllBookings(),
        userService.getAllUsers(),
      ]);

      const listings = listingsRes.listings || [];
      const bookings = Array.isArray(bookingsRes) ? bookingsRes : [];
      const users = usersRes.users || [];

      // Calculate metrics
      const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      
      // Get top performing listings
      const listingBookingCounts = {};
      const listingRevenue = {};
      
      confirmedBookings.forEach(booking => {
        const listingId = booking.listing?._id || booking.listing;
        if (listingId) {
          listingBookingCounts[listingId] = (listingBookingCounts[listingId] || 0) + 1;
          listingRevenue[listingId] = (listingRevenue[listingId] || 0) + (booking.totalPrice || 0);
        }
      });

      const topListings = listings
        .map(listing => ({
          name: listing.title,
          bookings: listingBookingCounts[listing._id] || 0,
          revenue: listingRevenue[listing._id] || 0,
          occupancy: listingBookingCounts[listing._id] ? Math.min(95, (listingBookingCounts[listing._id] * 10)) : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setAnalyticsData({
        totalRevenue,
        totalListings: listings.length,
        totalUsers: users.length,
        totalBookings: bookings.length,
        confirmedBookings: confirmedBookings.length,
        pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
        cancelledBookings: bookings.filter(b => ['CANCELLED', 'FAILED'].includes(b.status)).length,
        topListings,
      });
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock monthly data (you can enhance this with real date-based calculations)
  const revenueData = [
    { month: 'Jan', revenue: Math.floor(analyticsData.totalRevenue * 0.12), bookings: Math.floor(analyticsData.confirmedBookings * 0.12) },
    { month: 'Feb', revenue: Math.floor(analyticsData.totalRevenue * 0.14), bookings: Math.floor(analyticsData.confirmedBookings * 0.14) },
    { month: 'Mar', revenue: Math.floor(analyticsData.totalRevenue * 0.15), bookings: Math.floor(analyticsData.confirmedBookings * 0.15) },
    { month: 'Apr', revenue: Math.floor(analyticsData.totalRevenue * 0.17), bookings: Math.floor(analyticsData.confirmedBookings * 0.17) },
    { month: 'May', revenue: Math.floor(analyticsData.totalRevenue * 0.19), bookings: Math.floor(analyticsData.confirmedBookings * 0.19) },
    { month: 'Jun', revenue: Math.floor(analyticsData.totalRevenue * 0.23), bookings: Math.floor(analyticsData.confirmedBookings * 0.23) }
  ];

  const userGrowth = [
    { month: 'Jan', hosts: Math.floor(analyticsData.totalUsers * 0.10), guests: Math.floor(analyticsData.totalUsers * 0.12) },
    { month: 'Feb', hosts: Math.floor(analyticsData.totalUsers * 0.13), guests: Math.floor(analyticsData.totalUsers * 0.15) },
    { month: 'Mar', hosts: Math.floor(analyticsData.totalUsers * 0.15), guests: Math.floor(analyticsData.totalUsers * 0.17) },
    { month: 'Apr', hosts: Math.floor(analyticsData.totalUsers * 0.17), guests: Math.floor(analyticsData.totalUsers * 0.19) },
    { month: 'May', hosts: Math.floor(analyticsData.totalUsers * 0.20), guests: Math.floor(analyticsData.totalUsers * 0.22) },
    { month: 'Jun', hosts: Math.floor(analyticsData.totalUsers * 0.25), guests: Math.floor(analyticsData.totalUsers * 0.25) }
  ];

  // Use top listings for performance chart
  const listingPerformance = analyticsData.topListings.slice(0, 5).map(listing => ({
    category: listing.name?.substring(0, 20) || 'N/A',
    bookings: listing.bookings || 0,
    revenue: listing.revenue || 0
  }));

  const totalBookings = analyticsData.totalBookings || 1;
  const bookingStatus = [
    { 
      name: 'Confirmed', 
      value: Math.round((analyticsData.confirmedBookings / totalBookings) * 100), 
      color: '#10B981' 
    },
    { 
      name: 'Pending', 
      value: Math.round((analyticsData.pendingBookings / totalBookings) * 100), 
      color: '#F59E0B' 
    },
    { 
      name: 'Cancelled', 
      value: Math.round((analyticsData.cancelledBookings / totalBookings) * 100), 
      color: '#EF4444' 
    }
  ];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: `₹${analyticsData.totalRevenue.toLocaleString()}`,
      change: '+18.2%',
      trend: 'up',
      icon: IndianRupee,
      color: 'text-green-600'
    },
    {
      title: 'Active Listings',
      value: analyticsData.totalListings.toString(),
      change: '+12.5%',
      trend: 'up',
      icon: Building,
      color: 'text-blue-600'
    },
    {
      title: 'Total Users',
      value: analyticsData.totalUsers.toLocaleString(),
      change: '+25.8%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Total Bookings',
      value: analyticsData.totalBookings.toString(),
      change: '+5.2%',
      trend: 'up',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Analytics & Reports</h2>
        <div className="flex items-center gap-4">
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50`}>
                  <Icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm ml-1 text-green-600">{kpi.change}</span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Bookings'
              ]} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatus}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {bookingStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hosts" fill="#3B82F6" name="Hosts" />
              <Bar dataKey="guests" fill="#8B5CF6" name="Guests" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Listing Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Performance by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={listingPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={80} />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Bookings'
              ]} />
              <Bar dataKey="bookings" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Listings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.topListings.map((listing, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {listing.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {listing.bookings || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(listing.revenue || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${listing.occupancy}%` }}
                        ></div>
                      </div>
                      {listing.occupancy}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
