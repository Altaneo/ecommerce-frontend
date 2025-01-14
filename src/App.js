// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import BeautyPage from './pages/BeautyPage';
import HomeGoods from './pages/HomeGoods';
import Fashion from './pages/Fashion';
import Electronics from './pages/Electronics';
import CartPage from './pages/CartPage';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';
import ProfileLayout from './pages/Profile';
import UserDetails from './pages/Profile/UserDetails';
import MyOrders from './pages/Profile/MyOrders';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/electronics" element={<Electronics />} />
        <Route path="/fashion" element={<Fashion />} />
        <Route path="/beauty" element={<BeautyPage />} />
        <Route path="/home-goods" element={<HomeGoods />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<ProfileLayout />}>
          <Route path="user-details" element={<UserDetails />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="" element={<Navigate to="user-details" />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
