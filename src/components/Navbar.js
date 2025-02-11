import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  TextField,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';
import axios from 'axios';
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import ChatComponent from './Chatbot';
function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [authType, setAuthType] = useState('Login');
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalNotification, setTotalNotification] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation()
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const checkAuthToken = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/auth/check-auth`, { withCredentials: true });
      setIsAuthenticated(response.data.authenticated);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    checkAuthToken();
  }, []);
  const fetchData = async () => {
    try {
      const [cartResponse, notificationResponse] = await Promise.all([
        axios.get(`${apiBaseUrl}/api/cart/total-quantity`),
        axios.get(`${apiBaseUrl}/notifications`),
      ]);

      setTotalQuantity(cartResponse.data.totalQuantity);
      setTotalNotification(notificationResponse.data.count);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Effect to fetch data on location change
  useEffect(() => {
    fetchData();
  }, [location]);
  const handleOpenModal = (type) => {
    setAuthType(type);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    checkAuthToken();
  };
  const handleSignOut = async () => {
    try {
      await axios.post(`${apiBaseUrl}/api/auth/sign-out`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      await checkAuthToken()
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };


  return (
    <header className="fixed top-4 left-0 right-0 border-2 border-purple-300 rounded-full bg-white shadow-md flex items-center justify-between px-8 py-2 z-50">
      <h1 class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800">
        <Link to="/">
          Altaneofin Shop
        </Link>
      </h1>
      <nav className="nav font-semibold text-lg">
        <ul className="flex items-center">
          <li className="p-4 border-b-2 border-purple-500 border-opacity-0 hover:border-opacity-100 hover:text-purple-500 duration-200 cursor-pointer">
            <Link to="/home" state={{isAuthenticated:isAuthenticated}}>Home</Link>
          </li>
          <li className="p-4 border-b-2 border-purple-500 border-opacity-0 hover:border-opacity-100 hover:text-purple-500 duration-200 cursor-pointer">
            <Link to="/electronics">Electronics</Link>
          </li>
          <li className="p-4 border-b-2 border-purple-500 border-opacity-0 hover:border-opacity-100 hover:text-purple-500 duration-200 cursor-pointer">
            <Link to="/fashion">Fashion</Link>
          </li>
          <li className="p-4 border-b-2 border-purple-500 border-opacity-0 hover:border-opacity-100 hover:text-purple-500 duration-200 cursor-pointer">
            <Link to="/beauty">Beauty</Link>
          </li>
          <li className="p-4 border-b-2 border-purple-500 border-opacity-0 hover:border-opacity-100 hover:text-purple-500 duration-200 cursor-pointer">
            <Link to="/home-goods">Home Goods</Link>
          </li>
          {isAuthenticated && (<li className="p-4 border-b-2 border-purple-500 border-opacity-0 hover:border-opacity-100 hover:text-purple-500 duration-200 cursor-pointer">
            <Link to="/profile">Profile</Link>
          </li>)}
        </ul>
      </nav>
      <div className=" flex justify-end items-center">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              mr: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'purple', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: 'darkviolet', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'purple', // Border color when focused
                },
              },
            }}
          />
          <IconButton type="submit" sx={{ color: 'inherit' }}>
            <SearchIcon />
          </IconButton>
        </form>
        <IconButton color="inherit" component={Link} to="/cart">
          <div className="relative bg-blue-100 p-2 rounded-full">
            <svg
              className="h-8 w-8 text-blue-600 animate-wiggle"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <div className="px-1 py-0.5 bg-blue-500 min-w-5 rounded-full text-center text-white text-xs absolute -top-2 -right-1 translate-x-1/4 text-nowrap">
              <div className="absolute top-0 left-0 rounded-full -z-10 animate-ping bg-blue-200 w-full h-full"></div>
              {totalQuantity}
            </div>
          </div>
        </IconButton>
        <IconButton color="inherit" onClick={() => setChatOpen(true)}>
          <div className="relative bg-green-100 p-2 rounded-full">
            {/* Chat Icon */}
            <svg
              className="w-8 h-8 text-green-600 animate-wiggle"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
              <path d="M8 12h.01M12 12h.01M16 12h.01" />
            </svg>
          </div>


        </IconButton>
        <IconButton color="inherit" component={Link} to="/profile/notifications">
          <div className="relative bg-green-100 p-2 rounded-full">
            <svg
              className="w-8 h-8 text-green-600 animate-wiggle"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 21 21"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
              />
            </svg>
            <div className="px-1 py-0.5 bg-green-500 min-w-5 rounded-full text-center text-white text-xs absolute -top-2 -end-1 translate-x-1/4 text-nowrap">
              <div className="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-green-200 w-full h-full"></div>
              {totalNotification}
            </div>
          </div>
        </IconButton>
        {isAuthenticated ? (
          <>
            <IconButton onClick={handleProfileMenuOpen}>
              <div
                class="flex items-center justify-center h-12 w-12 bg-purple-100 rounded-full cursor-pointer hover:bg-purple-200 transition"
              >
                <svg
                  class="h-5 w-5 text-purple-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </IconButton>
            <Menu anchorEl={profileMenuAnchor} open={Boolean(profileMenuAnchor)} onClose={handleProfileMenuClose}>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </>
        ) : (
          <button onClick={() => handleOpenModal('Login')} class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800" >
            Login
          </button>
        )}
      </div>
      <AuthModal open={modalOpen} onClose={handleCloseModal} authType={authType} />
      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} fullWidth maxWidth="sm">
  <div className="relative">
    <IconButton
      aria-label="close"
      onClick={() => setChatOpen(false)}
      className="absolute top-2 left-2 z-10"
    >
      <CloseIcon />
    </IconButton>
    <DialogContent>
      <ChatComponent />
    </DialogContent>
  </div>
</Dialog>
    </header>
  );
}

export default Navbar;
