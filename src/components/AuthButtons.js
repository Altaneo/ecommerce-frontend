import React from 'react';
import {
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider,facebookProvider } from './firebaseConfig';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SignInButton from './PhoneSignUp';
import FacebookIcon from '@mui/icons-material/Facebook'
const useStyles = makeStyles({
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  googleButton: {
    textTransform: 'none!important',
    backgroundColor: '#fff',
    lineHeight:"2.78!important",
    border: '1px solid #ccc',
    color: '#000',
    width:"225px!important",
    fontSize:"14px!importantS",
  },
  facebookButton: {
    textTransform: 'none',
    backgroundColor: '#3b5998',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2d4373',
    },
  },
});

const AuthButtons = ({onClose}) => {
  const classes = useStyles();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Send ID token to the backend for verification
      const response = await axios.post(`${apiBaseUrl}/api/auth/verifyAuth-token`, { idToken });

      if (response.data.success) {
        console.log('Google Login Success:', response.data.user);
        alert('Login successful!');
        onClose()
      } else {
        alert('Login failed.');
      }
    } catch (error) {
      console.error('Error with Google login:', error);
      alert('Login failed.');
    }
  };
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const idToken = await result.user.getIdToken();

      // Send ID token to the backend for verification
      const response = await axios.post(`${apiBaseUrl}/api/auth/verifyAuth-token`, { idToken });

      if (response.data.success) {
        console.log('Facebook Login Success:', response.data.user);
        alert('Login successful!');
        onClose();
      } else {
        alert('Login failed.');
      }
    } catch (error) {
      console.error('Error with Facebook login:', error);
      alert('Login failed.');
    }
  };
  return (
    <>
    <div className={classes.buttonContainer}>
      <Button
        variant="outlined"
        onClick={handleGoogleLogin}
        startIcon={<FcGoogle />}
        className={classes.googleButton}
      >
        Login with Google
      </Button>
      <Button
        variant="contained"
        onClick={handleFacebookLogin}
        startIcon={<FacebookIcon />}
        className={classes.googleButton}
      >
        Login with Facebook
      </Button>
    </div>
    <div className={classes.buttonContainer}>
       <SignInButton onClose={onClose}/>
    </div>
    </>
  );
};

export default AuthButtons;
