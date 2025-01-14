import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f1f3f6",
    minHeight: "100vh",
  },
  card: {
    maxWidth: "800px",
    margin: "20px auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: '20px',
  },
  header: {
    backgroundColor: "#2874f0", // Flipkart's signature blue color
    color: "#fff", // White text for contrast
    padding: "15px 20px", // Padding for better spacing
    fontWeight: 600, // Bold text
    fontSize: "20px", // Slightly larger font size
    borderRadius: "4px 4px 0 0", // Rounded top corners
    textAlign: "center", // Center the text
    width: "95%", // Full width of the card
    marginBottom: '20px!important',
  },

  field: {
    marginBottom: "15px",
    marginTop: '10px'
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "10px",
    marginTop: "20px",
  },
  gridItem: {
    paddingLeft: "50px",
    width: '100%',
  },
  saveButton: {
    backgroundColor: "#2874f0",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#0d47a1",
    },
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#b71c1c",
    },
  },
  staticText: {
    color: "#757575",
    fontSize: "1rem",
  },
  textId: {
    fontSize: "1rem",
  }
});

const UserDetails = () => {
  const classes = useStyles();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addressData, setAddressData] = useState({
    pincode: '',
    locality: '',
    streetAddress: '',
    city: '',
    state: '',
    landmark: '',
    alternatePhone: '',
    addressType: 'Home',
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch user data
  const fetchUserData = async () => {
    // ... existing code ...
    try {
      const response = await axios.get(`${apiBaseUrl}/api/auth/profile`, {
        withCredentials: true,
      });
      setUserData(response.data.user);

      // Initialize addressData properly
      if (response.data.user.addresses && response.data.user.addresses.length > 0) {
        setAddressData(response.data.user.addresses[0]);
      } else {
        // Set to default if no address is found
        setAddressData({
          pincode: '',
          locality: '',
          streetAddress: '',
          city: '',
          state: '',
          landmark: '',
          alternatePhone: '',
          addressType: 'Home',
        });
      }
    } catch (error) {
      // ... existing code ...
    } finally {
      // ... existing code ...
    }
  };
  console.log(userData, addressData)
  // Update user data
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/auth/profileUpdate`,
        {
          name: userData.name,
          uid: userData._id,
          gender: userData.gender,
          email: userData.email,
          phone: userData.phone,
          addresses: [addressData],
        },
        { withCredentials: true }
      );
      setSuccess("Profile updated successfully!");
      setUserData(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
      <Card className={classes.card}>
        <Typography variant="h5" className={classes.header}>
          Personal Information
        </Typography>

        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">{success}</Typography>}

        {!loading ? (
          <>
            <Grid container spacing={2}>
              {/* Editable or Static Fields */}
              {isEditing ? (
                <>
                  <Grid item xs={24}>
                    <TextField
                      label="First Name"
                      name="name"
                      value={userData.name || ""}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      className={classes.field}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset" className={classes.field}>
                      <FormLabel component="legend">Gender</FormLabel>
                      <RadioGroup
                        row
                        name="gender"
                        value={userData.gender || ""}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="Male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="Female"
                          control={<Radio />}
                          label="Female"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      value={userData.email || ""}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      className={classes.field}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={userData.phone || ""}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      inputProps={{ maxLength: 10 }}
                      className={classes.field}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Pincode"
                      name="pincode"
                      value={addressData.pincode}
                      onChange={handleAddressChange}
                      variant="outlined"
                      fullWidth
                      className={classes.field}
                      required
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Locality"
                      name="locality"
                      value={addressData.locality}
                      onChange={handleAddressChange}
                      variant="outlined"
                      fullWidth
                      className={classes.field}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Address (Area and Street)"
                      name="streetAddress"
                      value={addressData.streetAddress}
                      onChange={handleAddressChange}
                      variant="outlined"
                      fullWidth
                      className={classes.field}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="City/District/Town"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      variant="outlined"
                      fullWidth
                      className={classes.field}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="State"
                      name="state"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      variant="outlined"
                      fullWidth
                      className={classes.field}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Landmark (Optional)"
                      name="landmark"
                      value={addressData.landmark}
                      onChange={handleAddressChange}
                      variant="outlined"
                      fullWidth
                      className={classes.field}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Alternate Phone (Optional)"
                      name="alternatePhone"
                      value={addressData.alternatePhone}
                      onChange={handleAddressChange}
                      variant="outlined"
                      inputProps={{ maxLength: 10 }}
                      fullWidth
                      className={classes.field}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel component="legend">Address Type</FormLabel>
                    <RadioGroup
                      row
                      name="addressType"
                      value={addressData.addressType}
                      onChange={handleAddressChange}
                    >
                      <FormControlLabel value="Home" control={<Radio />} label="Home" />
                      <FormControlLabel value="Work" control={<Radio />} label="Work" />
                    </RadioGroup>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} variant="body1" className={classes.gridItem}>
                    <Typography >
                      <strong className={classes.textId}>First Name: </strong>
                      <span className={classes.staticText}>{userData.name || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <Typography variant="body1">
                      <strong className={classes.textId}>Gender: </strong>
                      <span className={classes.staticText}>{userData.gender || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <Typography variant="body1">
                      <strong className={classes.textId}>Email: </strong>
                      <span className={classes.staticText}>{userData.email || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <Typography variant="body1">
                      <strong className={classes.textId}>Phone: </strong>
                      <span className={classes.staticText}>{userData.phone || "N/A"}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <Typography variant="body1">
                      <strong className={classes.textId}>Address: </strong>
                      <span className={classes.staticText}>
                        {`${addressData?.streetAddress || ''}, ${addressData?.locality || ''}\n${addressData?.city || ''}, ${addressData?.state || ''} ${addressData?.pincode || ''}\n${addressData?.country || 'India'}`}
                      </span>
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>

            <div className={classes.buttonGroup}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    className={classes.saveButton}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.cancelButton}
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  className={classes.saveButton}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Details
                </Button>
              )}
            </div>
          </>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Card>
 
  );
};

export default UserDetails;
