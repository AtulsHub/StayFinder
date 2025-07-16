import React, { useState } from 'react';
import CustomSidebar from './OwnerSidebar';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OwnerLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const selector = useSelector((state) => state.user?.userData?.name)

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50 relative">
      <CustomSidebar 
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-red-500">StayFinder Bussiness</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome, <span className='font-semibold text-lg ml-2 '>{selector}</span></div>
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

export default OwnerLayout;
