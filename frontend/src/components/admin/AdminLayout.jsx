import React, { useState } from 'react';
import CustomSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../backendConnect/user';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useSelector((state) => state.user?.userData);
  const navigate = useNavigate();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await userService.performLogout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50 relative">
      <CustomSidebar 
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        user={user}
      />
      
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-red-500">StayFinder Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?.avatar && (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              {!user?.avatar && (
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              )}
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.name || 'Admin'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
