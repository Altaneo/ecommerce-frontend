import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  IconButton,
} from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import AuthButtons from './AuthButtons';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  closeButton: {
  borderRadius:'unset!important',
    justifyContent:'flex-end!important',
  },
  dialog: {
    position: 'relative',
  },
  dialogTitle: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '2rem',
    color: '#333',
    marginBottom: '1rem',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  inputField: {
    width: '100%',
    marginBottom: '1rem',
  },
  continueButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    marginTop: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#394bc",
    },
    "&:disabled": {
      backgroundColor: "#ddd",
      cursor: "not-allowed",
    },
  },
  otpError: {
    marginTop: '0.5rem',
    color: 'red',
    fontSize: '0.875rem',
  },
  formControl: {
    width: '100%',
    marginBottom: '1rem',
  },
  sendOtpButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    marginTop: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "#394bc",
    },
    "&:disabled": {
      backgroundColor: "#ddd",
      cursor: "not-allowed",
    },
  },
});

function AuthModal({ open, onClose, authType }) {
  const classes = useStyles();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    gender: '',
    email: '',
    inviteCode: '',
    address: '',
  });
  axios.defaults.withCredentials = true;
  const [userExists, setUserExists] = useState(null);
  const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const isPhone = (value) => /^[0-9]{10}$/.test(value);
  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpSent) {
      try {
        const userCheckResponse = await axios.post(
          `${apiBaseUrl}/api/auth/check-user`,
          { emailOrPhone }
        );

        if (userCheckResponse.data.exists) {
          setUserExists(true);
          const otpResponse = await axios.post(`${apiBaseUrl}/api/auth/send-otp`, {
            emailOrPhone,
            isPhone: isPhone(emailOrPhone),
          });

          if (otpResponse.status === 200) {
            setIsOtpSent(true);
          } else {
            alert('Failed to send OTP.');
          }
        } else {
          setUserExists(false);
          setIsUserInfoVisible(true);
        }
      } catch (error) {
        alert('Error sending OTP. Please try again.');
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/auth/verify-otp`, {
          emailOrPhone,
          otp,
        });

        if (response.data.success) {
          console.log(`${authType} successful!`);
          onClose();
        } else {
          setOtpError(response.data.message || 'Invalid OTP');
        }
      } catch (error) {
        setOtpError('Error verifying OTP. Please try again.');
        console.error(error);
      }
    }
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSaveUserAndSendOtp = async () => {
    try {
      const userInfoData = {
        name: userInfo.name,
        gender: userInfo.gender,
        email: userInfo.email,
        inviteCode: userInfo.inviteCode,
        address: userInfo.address,
        phone: emailOrPhone,
      };

      const saveUserResponse = await axios.post(
        'http://localhost:5000/api/auth/save-user',
        userInfoData
      );
      if (saveUserResponse.status === 201) {
        alert('User saved and OTP sent');
        const otpResponse = await axios.post('http://localhost:5000/api/auth/send-otp', {
          emailOrPhone,
          isPhone: isPhone(emailOrPhone),
        });
        if (otpResponse.status === 200) {
          setIsOtpSent(true);
        } else {
          alert('Failed to send OTP.');
        }
      } else {
        alert('Failed to save user.');
      }
    } catch (error) {
      alert('Error saving user or sending OTP. Please try again.');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog}>
      <IconButton className={classes.closeButton} onClick={onClose}>
        <AiOutlineClose size={24} />
      </IconButton>
      <Typography className={classes.dialogTitle}>Welcome to Altaneofin</Typography>
      <DialogContent className={classes.dialogContent}>
        <AuthButtons onClose={onClose} />
        <TextField
          label="Enter Email"
          variant="outlined"
          fullWidth
          className={classes.inputField}
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />

        {userExists === false && isUserInfoVisible && (
          <>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={userInfo.name}
              onChange={handleUserInfoChange}
              name="name"
            />
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                name="gender"
                value={userInfo.gender}
                onChange={handleUserInfoChange}
                row
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={userInfo.email}
              onChange={handleUserInfoChange}
              name="email"
            />
            <TextField
              label="Invite Code"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={userInfo.inviteCode}
              onChange={handleUserInfoChange}
              name="inviteCode"
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={userInfo.address}
              onChange={handleUserInfoChange}
              name="address"
            />
            <button
              onClick={handleSaveUserAndSendOtp}
              fullWidth
              className={classes.sendOtpButton}
            >
              Send OTP
            </button>
          </>
        )}

        {isOtpSent && (
          <>
            <TextField
              label="OTP"
              variant="outlined"
              fullWidth
              className={classes.inputField}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {otpError && <Typography className={classes.otpError}>{otpError}</Typography>}
          </>
        )}
        
        <button onClick={handleSubmit} fullWidth className={classes.continueButton}>
          Continue
        </button>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
