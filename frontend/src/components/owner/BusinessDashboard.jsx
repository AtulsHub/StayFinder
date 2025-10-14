import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, Home, Settings, List } from 'lucide-react';
import { useSelector } from 'react-redux';
import AddListingForm from './AddListingForm';
import ListingsList from './ListingsList';
import DashboardStats from './DashboardStats';
import EditListingForm  from './EditListingForm';
import listingService from '../../backendConnect/listing';

const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = useSelector((state) => state.user?.userData?._id);

  // Fetch listings from backend
  useEffect(() => {
    if (!userId) return;

    const fetchListings = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await listingService.getListingsByUserId(userId);
        setListings(res.data || []);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        setError('Failed to fetch listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [userId]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'listings', label: 'My Listings', icon: List },
    { id: 'add-listing', label: 'Add Listing', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleAddListing = async (newListing) => {
    try {
      await listingService.addListing(newListing);
      // Refresh listings after adding
      const res = await listingService.getListingsByUserId(userId);
      setListings(res.data || []);
      setActiveTab('listings');
    } catch (err) {
      console.error('Failed to add listing:', err);
      alert('Failed to add listing.');
    }
  };

  const handleEditListing = async (updatedListing) => {
    try {
      await listingService.updateListing(updatedListing._id, updatedListing);
      // Refresh listings after editing
      const res = await listingService.getListingsByUserId(userId);
      setListings(res.data || []);
      setEditingListing(null);
      setActiveTab('listings');
    } catch (err) {
      console.error('Failed to update listing:', err);
      alert('Failed to update listing.');
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await listingService.deleteListing(listingId);
      setListings(listings.filter((listing) => listing._id !== listingId));
    } catch (err) {
      console.error('Failed to delete listing:', err);
      alert('Failed to delete listing.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8 text-gray-600">
          Loading dashboard data...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-600">
          {error}
        </div>
      );
    }

    if (editingListing) {
      return (
        <EditListingForm
          listing={editingListing}
          onSave={handleEditListing}
          onCancel={() => setEditingListing(null)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats listings={listings} />;
      case 'listings':
        return (
          <ListingsList
            listings={listings}
            onEdit={setEditingListing}
            onDelete={handleDeleteListing}
          />
        );
      case 'add-listing':
        return <AddListingForm onSubmit={handleAddListing} />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Settings
            </h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;