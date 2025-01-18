import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [authType, setAuthType] = useState('Login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
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

  const handleOpenProfileModal = () => {
    setProfileMenuAnchor(null);
    setProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
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

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <header className="fixed top-4 left-0 right-0 border-2 border-purple-300 rounded-full bg-white shadow-md flex items-center justify-between px-8 py-2 z-50">
      <h1 class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800">
        <Link to="/">
        Altaneofin Shop
        </Link>
      </h1>

      {/* Navigation */}
      <nav className="nav font-semibold text-lg">
        <ul className="flex items-center">
          <li className="p-4 border-b-2 border-purple-500 border-opacity-0 hover:border-opacity-100 hover:text-purple-500 duration-200 cursor-pointer">
            <Link to="/home">Home</Link>
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

      {/* Search and Profile */}
      <div className="w-3/12 flex justify-end items-center">
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
              <ShoppingCartIcon />
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
          <button  onClick={() => handleOpenModal('Login')} class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800" >
            Login
          </button>
        )}
      </div>
      <AuthModal open={modalOpen} onClose={handleCloseModal} authType={authType} />
    </header>
  );
}

export default Navbar;
