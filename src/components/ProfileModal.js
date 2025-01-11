import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  RadioGroup,
  Modal,
  Box,
  Alert,
  CircularProgress,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';
import axios from 'axios';

const ProfileModal = ({ open, onClose }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${apiBaseUrl}/api/auth/profile`, {
        withCredentials: true,
      });
      setUserData(response.data.user);
      setEmail(response.data.user.email);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/auth/profileUpdate`,
        {
          name: userData.name,
          uid: userData._id,
          gender: userData.gender,
          address: userData.address,
          email: userData.email,
          phone: userData.phone,
        },
        { withCredentials: true }
      );
      setSuccess('Profile updated successfully!');
      setUserData(response.data.user);

      // Close the modal after a short delay to show success message
      setTimeout(() => {
        onClose(); // Close the modal
      }, 1500); // Adjust the delay as needed
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserData();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Update Profile
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={userData.name}
          onChange={handleChange}
        />
        {email && (
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={userData.email}
            disabled // Email is typically not editable
          />
        )}
        {!email && (
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={userData.email}
            onChange={handleChange}
          />
        )}
        <TextField
          label="Phone"
          name="phone"
          fullWidth
          margin="normal"
          value={userData.phone}
          onChange={handleChange}
        />
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            name="gender"
            value={userData.gender} // Bind to gender in userData
            onChange={handleChange} // Update gender
            row
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>
        <TextField
          label="Address"
          name="address"
          fullWidth
          margin="normal"
          value={userData.address}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update'}
        </Button>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
