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
      const response = await axios.post(`${apiBaseUrl}/api/auth/verifyAuth-token`, { idToken },{withCredentials:true});

      if (response.data.success) {
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
      const response = await axios.post(`${apiBaseUrl}/api/auth/verifyAuth-token`, { idToken },{withCredentials:true});

      if (response.data.success) {
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
      <SignInButton onClose={onClose}/>
    <button  onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-3 bg-indigo-100 text-gray-800 rounded-lg shadow hover:shadow-lg transition">
                <div className="bg-white p-2 rounded-full">
                  <svg className="w-4" viewBox="0 0 533.5 544.3">
                    <path
                      d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                      fill="#4285f4"
                    />
                    <path
                      d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                      fill="#34a853"
                    />
                    <path
                      d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                      fill="#fbbc04"
                    />
                    <path
                      d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                      fill="#ea4335"
                    />
                  </svg>
                </div>
                <span className="ml-4">Sign Up with Google</span>
              </button>
              <button onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center h-12 bg-blue-100 text-gray-800 rounded-lg shadow hover:shadow-lg transition mt-4">
                <div className="bg-white p-2 rounded-full">
                  <svg className="w-4" viewBox="0 0 320 512">
                    <path
                      d="M279.14 288l14.22-92.66h-88.91V134.54c0-25.35 12.42-50.06 52.24-50.06H293V6.26S273.52 0 248.57 0c-73.22 0-121.53 44.38-121.53 124.72v70.62H56.89V288h70.15v224h92.58V288z"
                      fill="#1877f2"
                    />
                  </svg>
                </div>
                <span className="ml-4">Login with Facebook</span>
              </button>
     
    </>
  );
};

export default AuthButtons;
