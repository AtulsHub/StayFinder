import React, { useState } from 'react';
import { Plus, BarChart3, Home, Settings, List } from 'lucide-react';
import AddListingForm from './AddListingForm';
import ListingsList from './ListingsList';
import DashboardStats from './DashboardStats';
import EditListingForm  from './EditListingForm';

const BusinessDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [listings, setListings] = useState([]);
  const [editingListing, setEditingListing] = useState(null);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'listings', label: 'My Listings', icon: List },
    { id: 'add-listing', label: 'Add Listing', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleAddListing = (newListing) => {
    const listing = {
      ...newListing,
      _id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setListings([...listings, listing]);
    setActiveTab('listings');
  };

  const handleEditListing = (updatedListing) => {
    setListings(
      listings.map((listing) =>
        listing._id === updatedListing._id ? updatedListing : listing
      )
    );
    setEditingListing(null);
    setActiveTab('listings');
  };

  const handleDeleteListing = (listingId) => {
    setListings(listings.filter((listing) => listing._id !== listingId));
  };

  const renderContent = () => {
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