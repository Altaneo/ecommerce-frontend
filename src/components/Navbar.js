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
import ProfileModal from './ProfileModal';
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
      const response = await axios.get(`${apiBaseUrl}/api/auth/check-auth`, {
        withCredentials: true,
      });
      setIsAuthenticated(response.data.authenticated);
    } catch (error) {
      console.error('Error checking auth token:', error);
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
      await axios.post('http://localhost:5000/api/auth/sign-out', {}, { withCredentials: true });
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
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', sm: 'none' } }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}
          >
            Altaneofin Shop
          </Typography>
          {/* Search Bar */}
          <form
      onSubmit={handleSearchSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexGrow: 2,
        justifyContent: 'center',
      }}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{
          bgcolor: 'white',
          borderRadius: 1,
          minWidth: { xs: '200px', sm: '300px' },
        }}
      />
      {/* Replace the Button with IconButton */}
      <IconButton type="submit" sx={{ color: 'white' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </form>
          {/* Links and Icons */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button component={Link} to="/home" color="inherit">
              Home
            </Button>
            <Button component={Link} to="/electronics" color="inherit">
              Electronics
            </Button>
            <Button component={Link} to="/fashion" color="inherit">
              Fashion
            </Button>
            <Button component={Link} to="/beauty" color="inherit">
              Beauty
            </Button>
            <Button component={Link} to="/home-goods" color="inherit">
              Home Goods
            </Button>
            <IconButton color="inherit" component={Link} to="/cart">
              <ShoppingCartIcon />
            </IconButton>
            {isAuthenticated ? (
              <>
                <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={profileMenuAnchor}
                  open={Boolean(profileMenuAnchor)}
                  onClose={handleProfileMenuClose}
                >
                  <MenuItem onClick={handleOpenProfileModal}>Profile</MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </Menu>
              </>
            ) : (
              <Button onClick={() => handleOpenModal('Login')} color="inherit">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem button component={Link} to="/home" onClick={() => toggleDrawer(false)}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/electronics"
              onClick={() => toggleDrawer(false)}
            >
              <ListItemText primary="Electronics" />
            </ListItem>
            <ListItem button component={Link} to="/fashion" onClick={() => toggleDrawer(false)}>
              <ListItemText primary="Fashion" />
            </ListItem>
            <ListItem button component={Link} to="/beauty" onClick={() => toggleDrawer(false)}>
              <ListItemText primary="Beauty" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/home-goods"
              onClick={() => toggleDrawer(false)}
            >
              <ListItemText primary="Home Goods" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {/* Modals */}
      <AuthModal open={modalOpen} onClose={handleCloseModal} authType={authType} />
      <ProfileModal open={profileModalOpen} onClose={handleCloseProfileModal} />
    </>
  );
}

export default Navbar;
