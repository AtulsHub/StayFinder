import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import Wishlist from "./pages/Wishlist";
import "./tailwind.css";
import ConnectBusiness from "./components/owner/ConnectBusiness";
import Loader from "./pages/Loader.jsx";

// Admin section (lazy-loaded ✅)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./components/admin/DashBoard"));
const ListingsManagement = lazy(() => import("./components/admin/ListingsManagement"));
const BookingsManagement = lazy(() => import("./components/admin/BookingsManagement"));
const UserManagement = lazy(() => import("./components/admin/UserManagement"));
const Analytics = lazy(() => import("./components/admin/Analytics"));
const Settings = lazy(() => import("./components/admin/Settings"));

// Owner section (import normally ⬇️)
import OwnerLayout from "./components/owner/OwnerLayout";
import BusinessDashboard from "./components/owner/BusinessDashboard";
import ListingsList from "./components/owner/ListingsList";
import AddListingForm from "./components/owner/AddListingForm";
import OwnerBookingsView from "./components/owner/OwnerBookingsView";
import OwnerAnalytics from "./components/owner/OwnerAnalytics";

const App = () => {
  return (
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/store" element={<Explore />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/register-business" element={<ConnectBusiness />} />

          {/* Admin nested routes (lazy-loaded ✅) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="listings" element={<ListingsManagement />} />
            <Route path="bookings" element={<BookingsManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Owner nested routes (regular import ⬇️) */}
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<BusinessDashboard />} />
            <Route path="dashboard" element={<BusinessDashboard />} />
            <Route path="listings" element={<ListingsList />} />
            <Route path="add-listing" element={<AddListingForm />} />
            <Route path="booking/:listingId" element={<OwnerBookingsView />} />
            <Route path="analytics" element={<OwnerAnalytics />} />
          </Route>
        </Routes>
      </Suspense>
  );
};

export default App;
