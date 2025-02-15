import { createContext, useState, useContext,useEffect } from "react";
import AuthModal from "../components/AuthModal";
import axios from "axios";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authType, setAuthType] = useState(null);
  const [role, setRole] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkAuthToken = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/auth/check-auth`, { withCredentials: true });
      setIsAuthenticated(response.data.authenticated);
      setRole(response.data.role)
    } catch (error) {
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    checkAuthToken();
  }, [isAuthenticated,role]);
  const handleOpenModal = (type) => {
    setAuthType(type);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{ authType, modalOpen, role, handleOpenModal,isAuthenticated }}>
      {children}
      <AuthModal open={modalOpen} onClose={handleCloseModal} authType={authType} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
