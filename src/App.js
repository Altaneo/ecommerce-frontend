// src/App.js
import React, { useState } from 'react';
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
import Notifications from './pages/Profile/Notification';
import ProductDetails from './pages/ProductDetails';
import YouTubeLive from './pages/LiveStream';
import LivestreamDetails from './pages/LivestreamDetails';
import UserPage from './pages/UserPage';
import { AuthProvider } from './context/AuthContext';
import {VideoDisplayPage} from './pages/VideoDisplayPage';
import Dashboard from './components/Dashboard';
import ManualLiveStream from './pages/ManualLiveStream';
import { useTranslation } from "react-i18next";
import "./i18n";
function App() {
  const { t, i18n } = useTranslation();

  return (
    <AuthProvider>
    <Router>
      <Navbar />
     
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/electronics" element={<Electronics />} />
        <Route path="/fashion" element={<Fashion />} />
        <Route path="/beauty" element={<BeautyPage />} />
        <Route path="/home-goods" element={<HomeGoods />} />
        <Route path="/live" element={<YouTubeLive />} />
        <Route path="/video/live/:broadcastId" element={<Dashboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/influencer/:id" element={<UserPage/>} />
        <Route path="/manual-live" element={<ManualLiveStream/>}/>
        <Route path="/livestream/:streamId" element={<LivestreamDetails />} />
        <Route path="/video/:videoId" element={<VideoDisplayPage />} />
        <Route path="/profile" element={<ProfileLayout />}>
          <Route path="user-details" element={<UserDetails />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="" element={<Navigate to="user-details" />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
      <Footer />
    </Router>
    </AuthProvider>
  );
}

export default App;
