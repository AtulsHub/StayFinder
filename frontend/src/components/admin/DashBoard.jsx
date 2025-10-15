
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import listingService from '../../backendConnect/listing';
import bookingService from '../../backendConnect/booking';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalListings: 0,
    totalBookings: 0,
    totalUsers: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all listings
        const listingsRes = await listingService.getAllItems(1, 1000);
        const listings = listingsRes.listings || [];

        // Fetch all bookings
        const bookingsRes = await bookingService.getAllBookings();
        const bookings = Array.isArray(bookingsRes) ? bookingsRes : [];
        
        // Filter confirmed bookings
        const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');

        // Calculate total revenue
        const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        // Get unique users from bookings
        const uniqueUsers = new Set(confirmedBookings.map(b => b.user?._id || b.user).filter(Boolean));

        setStats({
          totalRevenue,
          totalListings: listings.length,
          totalBookings: confirmedBookings.length,
          totalUsers: uniqueUsers.size,
        });

        // Get recent bookings (last 5)
        const recent = [...confirmedBookings]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(booking => ({
            id: booking._id,
            guest: booking.user?.name || booking.user?.email || 'Guest',
            property: booking.listing?.title || 'Property',
            amount: `₹${booking.totalPrice?.toLocaleString()}`,
            status: booking.status,
            checkIn: booking.checkIn,
          }));

        setRecentBookings(recent);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Listings',
      value: stats.totalListings.toString(),
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          </div>
          <div className="p-6">
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{booking.guest}</p>
                      <p className="text-sm text-gray-500">{booking.property}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{booking.amount}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No recent bookings</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/admin/listings')}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Building className="h-4 w-4 mr-2" />
                Manage Listings
              </button>
              <button 
                onClick={() => navigate('/admin/users')}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </button>
              <button 
                onClick={() => navigate('/admin/bookings')}
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Bookings
              </button>
              <button 
                onClick={() => navigate('/admin/analytics')}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
