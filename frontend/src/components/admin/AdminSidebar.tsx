import React from 'react';
import { 
  Home, 
  BarChart, 
  Calendar, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const AdminSidebar = ({ isCollapsed, onToggleCollapse }: AdminSidebarProps) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { id: 'listings', label: 'Listings', icon: Home, path: '/admin/listings' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/admin/bookings' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'analytics', label: 'Analytics', icon: BarChart, path: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'} sticky top-0 h-screen`}>
      {/* Sidebar Header */}
      <div className={`p-3.5 border-b border-gray-200 transition-all duration-500 ease-in-out ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div className="flex items-center justify-between">
          <span
            className={`text-xl font-bold text-red-500 transition-all duration-500 ease-in-out 
              ${isCollapsed ? 'opacity-0 max-w-0 pointer-events-none select-none' : 'opacity-100 max-w-xs'}
            `}
            style={{ display: 'inline-block', overflow: 'hidden', transition: 'all 0.3s' }}
          >
            StayFinder
          </span>
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <div className="space-y-2">
          <span
            className={`text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 transition-all duration-300 ease-in-out
              ${isCollapsed ? 'opacity-0 max-w-0 pointer-events-none select-none hidden' : 'opacity-100 max-w-xs'}
            `}
            style={{ display: 'block', overflow: 'hidden', transition: 'all 0.3s' }}
          >
            Navigation
          </span>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out
                  ${isActive(item.path)
                    ? 'bg-red-50 text-red-600 border-r-2 border-red-500'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0 transition-all duration-300 ease-in-out" />
                <span
                  className={`ml-3 transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'opacity-0 max-w-0 pointer-events-none select-none' : 'opacity-100 max-w-xs'}
                  `}
                  style={{ display: 'inline-block', overflow: 'hidden', transition: 'all 0.3s' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}> 
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium transition-all duration-300 ease-in-out">
            A
          </div>
          <span
            className={`flex-1 min-w-0 transition-all duration-300 ease-in-out
              ${isCollapsed ? 'opacity-0 max-w-0 pointer-events-none select-none' : 'opacity-100 max-w-xs'}
            `}
            style={{ display: 'inline-block', overflow: 'hidden', transition: 'all 0.3s' }}
          >
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@stayfinder.com</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
