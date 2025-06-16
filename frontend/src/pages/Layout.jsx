// components/Layout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Loader from "../pages/Loader";

const Layout = () => {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setShowLoader(true); // Show loader on route change

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2300); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup on route change
  }, [location]);

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          <Outlet />
        </>
      )}
    </>
  );
};

export default Layout;
