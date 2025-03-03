import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  TextField,
  Drawer,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ChatComponent from "./Chatbot";
import { useTranslation } from "react-i18next";
import "../i18n";
import LanguageIcon from "@mui/icons-material/Language";
function Navbar() {

  const [modalOpen, setModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authType, setAuthType] = useState("Login");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalNotification, setTotalNotification] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  const checkAuthToken = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/auth/check-auth`, {
        withCredentials: true,
      });
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
      await axios.post(
        `${apiBaseUrl}/api/auth/sign-out`,
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      await checkAuthToken();
    } catch (error) {
      console.error("Error signing out:", error);
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
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu & change language
  const handleClose = (lang) => {
    i18n.changeLanguage(lang);
    setAnchorEl(null);
  };
console.log(totalQuantity,"-----------totalQuantity.length")
  return (
    <header className="fixed top-0 left-0 right-0 border-2 border-purple-300 rounded-full bg-white shadow-md flex items-center justify-between px-4 md:px-8 py-3 z-50">
      {/* Logo & Menu Button */}
      <div className="flex items-center">
        <h1 className="text-purple-700 font-bold text-xl md:text-2xl">
          <Link to="/">Altaneofin Shop</Link>
        </h1>
      </div>

      {/* Navigation Menu (Hidden on Small Screens) */}
      <nav className="hidden md:flex font-semibold text-lg">
        <ul className="flex items-center space-x-6">
          <li>
            <Link to="/home" className="hover:text-purple-500">
              {t("HOME")}
            </Link>
          </li>
          <li>
            <Link to="/electronics" className="hover:text-purple-500">
              
              {t("ELECTRONICS")}
            </Link>
          </li>
          <li>
            <Link to="/fashion" className="hover:text-purple-500">
            {t("FASHION")}
            </Link>
          </li>
          <li>
            <Link to="/beauty" className="hover:text-purple-500">
            {t("BEAUTY")}
            </Link>
          </li>
          <li>
            <Link to="/home-goods" className="hover:text-purple-500">
            {t("HOME_GOODS")}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Icons & Search */}
      <div className="hidden md:flex items-center space-x-3">
        <form
          onSubmit={handleSearchSubmit}
          className="hidden sm:flex items-center"
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder={t("SEARCH")}
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-white rounded-md"
          />
          <IconButton type="submit">
            <SearchIcon />
          </IconButton>
        </form>

        {/* Cart & Notifications */}
        <IconButton component={Link} to="/cart">
          <div className="relative bg-blue-100 p-2 rounded-full">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {totalQuantity!==0 && ( <div className="px-1 py-0.5 bg-blue-500 min-w-5 rounded-full text-center text-white text-xs absolute -top-2 -right-1 translate-x-1/4 text-nowrap">
              <div className="absolute top-0 left-0 rounded-full -z-10 animate-ping bg-blue-200 w-full h-full"></div>
              {totalQuantity}
            </div>)}
          </div>
        </IconButton>

        <IconButton color="inherit" onClick={() => setChatOpen(true)}>
          <div className="relative bg-green-100 p-2 rounded-full">
            <svg
              className="w-8 h-8 text-green-600"
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

        <IconButton
          color="inherit"
          component={Link}
          to="/profile/notifications"
        >
          <div className="relative bg-green-100 p-2 rounded-full">
            <svg
              className="w-8 h-8 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 21 21"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
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
        <IconButton onClick={handleClick}>
        <LanguageIcon fontSize="large" />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleClose("en")}>English</MenuItem>
        <MenuItem onClick={() => handleClose("hi")}>हिन्दी</MenuItem>
        <MenuItem onClick={() => handleClose("ta")}>Tamil</MenuItem>
        <MenuItem onClick={() => handleClose("g")}>Gujrati</MenuItem>
      </Menu>
        {isAuthenticated ? (
          <>
            <IconButton onClick={handleProfileMenuOpen}>
              <div class="flex items-center justify-center h-12 w-12 bg-purple-100 rounded-full cursor-pointer hover:bg-purple-200 transition">
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
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleSignOut}>{t("SIGN_OUT")}</MenuItem>
              <MenuItem><Link to="/profile">{t("PROFILE")}</Link></MenuItem>
            </Menu>
          </>
        ) : (
          <button
            onClick={() => handleOpenModal("Login")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            {t("LOGIN")}
          </button>
        )}
      </div>
      <div className="flex items-center md:hidden">
        <IconButton
          className="md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </div>
      {/* Mobile Drawer Menu */}
      <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="w-64 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-left"
            >
              <svg
                className="w-6 h-6 text-gray-700 hover:text-red-500 transition"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center">
                <IconButton onClick={handleProfileMenuOpen}>
                  <div className="flex items-center justify-center h-12 w-12 bg-purple-100 rounded-full cursor-pointer hover:bg-purple-200 transition">
                    <svg
                      className="h-5 w-5 text-purple-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </IconButton>
                <Menu
                  anchorEl={profileMenuAnchor}
                  open={Boolean(profileMenuAnchor)}
                  onClose={handleProfileMenuClose}
                >
                  <MenuItem onClick={handleSignOut}>{t("SIGN_OUT")}</MenuItem>
                </Menu>
              </div>
            ) : (
              <button
                onClick={() => handleOpenModal("Login")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                {t("LOGIN")}
              </button>
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <TextField
              variant="outlined"
              size="small"
              placeholder={t("SEARCH")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-white rounded-md w-full"
            />
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
          </form>

          <ul className="space-y-3">
            <li>
              <Link to="/home">{t("HOME")}</Link>
            </li>
            <li>
              <Link to="/electronics">{t("ELECTRONICS")}</Link>
            </li>
            <li>
              <Link to="/fashion">{t("FASHION")}</Link>
            </li>
            <li>
              <Link to="/beauty">{t("BEAUTY")}</Link>
            </li>
            <li>
              <Link to="/home-goods">{t("HOME_GOODS")}</Link>
            </li>
          </ul>

          {/* User Authentication Section */}

          {/* Icons Section */}
          <div className="flex justify-around mt-4">
            <IconButton component={Link} to="/cart">
              <div className="relative bg-blue-100 p-2 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
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
                  0
                </div>
              </div>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={() => {
                /* Handle chat open */
              }}
            >
              <div className="relative bg-green-100 p-2 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
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

            <IconButton
              color="inherit"
              component={Link}
              to="/profile/notifications"
            >
              <div className="relative bg-green-100 p-2 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21 21"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
                  />
                </svg>
                <div className="px-1 py-0.5 bg-green-500 min-w-5 rounded-full text-center text-white text-xs absolute -top-2 -right-1 translate-x-1/4 text-nowrap">
                  <div className="absolute top-0 left-0 rounded-full -z-10 animate-ping bg-green-200 w-full h-full"></div>
                  0
                </div>
              </div>
            </IconButton>
          </div>
        </div>
      </Drawer>

      {/* Auth Modal */}
      <AuthModal
        open={modalOpen}
        onClose={handleCloseModal}
        authType={authType}
      />

      {/* Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <IconButton
          onClick={() => setChatOpen(false)}
          className="absolute top-2 left-2"
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <ChatComponent />
        </DialogContent>
      </Dialog>
    </header>
  );
}

export default Navbar;
