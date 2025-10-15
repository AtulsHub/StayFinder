
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  UserCheck, 
  UserX, 
  Mail,
  Phone,
  Calendar,
  Building,
  Eye,
  Ban,
  CheckCircle,
  Shield,
  ShieldOff
} from 'lucide-react';
import userService from '../../backendConnect/user';
import listingService from '../../backendConnect/listing';
import bookingService from '../../backendConnect/booking';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAdmin, setFilterAdmin] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getAllUsers();
      const fetchedUsers = response.users || [];
      
      // Fetch additional stats for each user
      const usersWithStats = await Promise.all(
        fetchedUsers.map(async (user) => {
          try {
            let totalListings = 0;
            let totalBookings = 0;
            
            if (user.isHost) {
              const listings = await listingService.getListingsByUserId(user._id);
              totalListings = listings?.listings?.length || 0;
            }
            
            const bookings = await bookingService.getBookingsByUser(user._id);
            totalBookings = Array.isArray(bookings) ? bookings.length : 0;
            
            return {
              ...user,
              role: user.isHost ? 'host' : 'guest',
              status: user.status || 'active',
              totalListings,
              totalBookings,
            };
          } catch (err) {
            return {
              ...user,
              role: user.isHost ? 'host' : 'guest',
              status: user.status || 'active',
              totalListings: 0,
              totalBookings: 0,
            };
          }
        })
      );
      
      setUsers(usersWithStats);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    try {
      await userService.updateUserStatus(userId, newStatus);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
      alert(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
    } catch (err) {
      console.error('Failed to update user status:', err);
      alert('Failed to update user status. Please try again.');
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to promote this user to admin? They will have full access to the admin panel.')) {
      return;
    }
    
    try {
      await userService.promoteToAdmin(userId);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isAdmin: true } : user
      ));
      alert('User promoted to admin successfully');
    } catch (err) {
      console.error('Failed to promote user:', err);
      alert('Failed to promote user. Please try again.');
    }
  };

  const handleDemoteFromAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to remove admin privileges from this user?')) {
      return;
    }
    
    try {
      await userService.demoteFromAdmin(userId);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isAdmin: false } : user
      ));
      alert('Admin privileges removed successfully');
    } catch (err) {
      console.error('Failed to demote admin:', err);
      alert(err.message || 'Failed to remove admin privileges. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'suspended': return <UserX className="h-4 w-4 text-red-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'host': return 'bg-blue-100 text-blue-800';
      case 'guest': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesAdmin = filterAdmin === 'all' || 
                        (filterAdmin === 'admin' && user.isAdmin) ||
                        (filterAdmin === 'regular' && !user.isAdmin);
    return matchesSearch && matchesRole && matchesStatus && matchesAdmin;
  });

  const totalHosts = users.filter(u => u.role === 'host').length;
  const totalGuests = users.filter(u => u.role === 'guest').length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;
  const totalAdmins = users.filter(u => u.isAdmin).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
        <div className="text-sm text-gray-600">
          Total Users: {users.length}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hosts</p>
              <p className="text-2xl font-bold text-blue-600">{totalHosts}</p>
            </div>
            <Building className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-purple-600">{totalGuests}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Admins</p>
              <p className="text-2xl font-bold text-purple-600">{totalAdmins}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-red-600">{suspendedUsers}</p>
            </div>
            <UserX className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
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
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="host">Hosts</option>
                <option value="guest">Guests</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={filterAdmin}
              onChange={(e) => setFilterAdmin(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="regular">Regular Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email || 'N/A'}
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <div className="flex items-center">
                        {getStatusIcon(user.status)}
                        <span className={`ml-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isAdmin ? (
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-purple-500 mr-1" />
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Regular User</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last active: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.role === 'host' ? (
                      <div>
                        <div>{user.totalListings || 0} listings</div>
                        <div className="text-xs text-gray-500">Host account</div>
                      </div>
                    ) : (
                      <div>
                        <div>{user.totalBookings || 0} bookings</div>
                        <div className="text-xs text-gray-500">Guest account</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          onClick={() => handleToggleStatus(user._id, user.status)}
                          className="text-red-600 hover:text-red-900"
                          title="Suspend User"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleToggleStatus(user._id, user.status)}
                          className="text-green-600 hover:text-green-900"
                          title="Activate User"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {!user.isAdmin ? (
                        <button 
                          onClick={() => handlePromoteToAdmin(user._id)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Promote to Admin"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDemoteFromAdmin(user._id)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Remove Admin Privileges"
                        >
                          <ShieldOff className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
