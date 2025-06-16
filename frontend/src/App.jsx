import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/Wishlist";
import Layout from "./pages/Layout";
import "./tailwind.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Nested routes under Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/listing" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/store" element={<Explore />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
