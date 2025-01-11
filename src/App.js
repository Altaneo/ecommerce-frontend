// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes ,Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import BeautyPage from './pages/BeautyPage';
import HomeGoods from './pages/HomeGoods';
import Fashion from './pages/Fashion';
import Electronics from './pages/Electronics';
import CartPage from './pages/CartPage';
import SearchResults from '../src/components/SearchResults'; 
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/electronics" element={<Electronics/>} />
        <Route path="/fashion" element={<Fashion/>} />
        <Route path="/beauty" element={<BeautyPage/>} />
        <Route path="/home-goods" element={<HomeGoods/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;
