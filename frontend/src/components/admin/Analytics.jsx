
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building, 
  Calendar 
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

const Analytics = () => {
  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 85000, bookings: 45 },
    { month: 'Feb', revenue: 92000, bookings: 52 },
    { month: 'Mar', revenue: 108000, bookings: 63 },
    { month: 'Apr', revenue: 125000, bookings: 71 },
    { month: 'May', revenue: 140000, bookings: 84 },
    { month: 'Jun', revenue: 158000, bookings: 95 }
  ];

  const listingPerformance = [
    { category: 'Luxury Villas', bookings: 35, revenue: 185000 },
    { category: 'Beach Houses', bookings: 28, revenue: 142000 },
    { category: 'Mountain Resorts', bookings: 22, revenue: 98000 },
    { category: 'City Apartments', bookings: 45, revenue: 78000 },
    { category: 'Cottages', bookings: 18, revenue: 54000 }
  ];

  const userGrowth = [
    { month: 'Jan', hosts: 45, guests: 158 },
    { month: 'Feb', hosts: 52, guests: 189 },
    { month: 'Mar', hosts: 48, guests: 234 },
    { month: 'Apr', hosts: 63, guests: 267 },
    { month: 'May', hosts: 71, guests: 312 },
    { month: 'Jun', hosts: 78, guests: 365 }
  ];

  const bookingStatus = [
    { name: 'Confirmed', value: 68, color: '#10B981' },
    { name: 'Pending', value: 22, color: '#F59E0B' },
    { name: 'Cancelled', value: 10, color: '#EF4444' }
  ];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '₹7,08,000',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Listings',
      value: '148',
      change: '+12.5%',
      trend: 'up',
      icon: Building,
      color: 'text-blue-600'
    },
    {
      title: 'Total Users',
      value: '1,845',
      change: '+25.8%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Booking Rate',
      value: '78.5%',
      change: '+5.2%',
      trend: 'up',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

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
              {[
                { name: 'Luxury Villa in Goa', bookings: 24, revenue: 360000, occupancy: 85 },
                { name: 'Beach House Mumbai', bookings: 18, revenue: 225000, occupancy: 72 },
                { name: 'Mountain Resort Shimla', bookings: 15, revenue: 133500, occupancy: 68 },
                { name: 'City Apartment Delhi', bookings: 22, revenue: 110000, occupancy: 78 }
              ].map((listing, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {listing.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {listing.bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{listing.revenue.toLocaleString()}
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
