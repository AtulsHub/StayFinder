import React from "react";
import { Home, Building2, Settings, Menu, X, Plus, BarChart3 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OwnerSidebar = ({ isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selector = useSelector((state) => state.user?.userData);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/owner/dashboard",
    },
    {
      id: "listings",
      label: "My Listings",
      icon: Building2,
      path: "/owner/listings",
    },
    {
      id: "add-listing",
      label: "Add Listing",
      icon: Plus,
      path: "/owner/add-listing",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/owner/analytics",
    },
    // { id: "settings", label: "Settings", icon: Settings, path: "/owner/settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      } sticky top-0 h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 flex justify-between items-center">
        {!isCollapsed && (
          <span className="text-xl font-bold text-red-500 transition-all duration-300">
            StayFinder
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {!isCollapsed && (
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 block">
            Business Management
          </span>
        )}

        {navigationItems.map(({ id, label, icon: Icon, path }) => (
          <button
            key={id}
            onClick={() => navigate(path)}
            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all
              ${
                isActive(path)
                  ? "bg-red-50 text-red-600 border-r-2 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }
              ${isCollapsed ? "justify-center" : "justify-start"}
            `}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3 truncate">{label}</span>}
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          {selector.avatar ? (
            <img
              src={selector.avatar}
              className="w-8 h-8 object-cover rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {selector.name.charAt(0)}
            </div>
          )}
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selector.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{selector.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default OwnerSidebar;
