
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  MapPin,
  Star,
  Building
} from 'lucide-react';
import listingService from '../../backendConnect/listing';
import { useNavigate } from 'react-router-dom';

const ListingsManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listingService.getAllItems(1, 1000);
      setListings(response.listings || []);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await listingService.deleteListing(id);
      setListings(listings.filter(listing => listing._id !== id));
      alert('Listing deleted successfully');
    } catch (err) {
      console.error('Failed to delete listing:', err);
      alert('Failed to delete listing. Please try again.');
    }
  };

  const handleView = (id) => {
    navigate(`/listing/${id}`);
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || listing.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchListings}
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
                src={listing.images?.[0]?.url || '/api/placeholder/300/200'}
                alt={listing.images?.[0]?.title || listing.title}
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
                {listing.location?.city || 'N/A'}, {listing.location?.state || 'N/A'}
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{listing.rating || 'N/A'}</span>
                  <span className="text-sm text-gray-500 ml-1">({listing.totalBookings || 0} bookings)</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ₹{listing.pricePerNight?.toLocaleString() || 0}/night
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                Host: {listing.host?.name || listing.host?.email || 'N/A'}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleView(listing._id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm">
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(listing._id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
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
