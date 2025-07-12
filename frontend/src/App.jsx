import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist";
import Layout from "./pages/Layout";
import "./tailwind.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/userSlice";
import userService from "./backendConnect/user";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/DashBoard";
import ListingsManagement from "./components/admin/ListingsManagement";
import BookingsManagement from "./components/admin/BookingsManagement";
import UserManagement from "./components/admin/UserManagement";
import Analytics from "./components/admin/Analytics";
import Settings from "./components/admin/Settings";
import { BusinessDashboard } from "./components/owner/BusinessDashboard";
import OwnerLayout from "./components/owner/OwnerLayout";
import { ListingsList } from "./components/owner/ListingsList";
import { AddListingForm } from "./components/owner/AddListingForm";
import { EditListingForm } from "./components/owner/EditListingForm";
import { DashboardStats } from "./components/owner/DashboardStats";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Nested routes under Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/store" element={<Explore />} />
          <Route path="/wishlist" element={<Wishlist />} />
          {/* Admin nested routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="listings" element={<ListingsManagement />} />
            <Route path="bookings" element={<BookingsManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route
            path="/owner"
            element={
              <OwnerLayout>
                <Outlet />
              </OwnerLayout>
            }
          >
            <Route index element={<BusinessDashboard />} />
            <Route path="dashboard" element={<BusinessDashboard />} />
            <Route path="listings" element={<ListingsList />} />
            <Route path="add-listing" element={<AddListingForm />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
