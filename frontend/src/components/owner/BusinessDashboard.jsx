import React, { useState } from 'react';
import { Plus, BarChart3, Home, Settings, List } from 'lucide-react';
import { AddListingForm } from './AddListingForm';
import { ListingsList } from './ListingsList';
import { DashboardStats } from './DashboardStats';
import { EditListingForm } from './EditListingForm';

export const BusinessDashboard = () => {
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                StayFinder Business
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back, Host!</span>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">H</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          {/* <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div> */}
          

          {/* Main Content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};
