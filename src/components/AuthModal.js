import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai';
import AuthButtons from './AuthButtons';

function AuthModal({ open, onClose, authType }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    gender: '',
    email: '',
    inviteCode: '',
  });
  axios.defaults.withCredentials = true;
  const [userExists, setUserExists] = useState(null);
  const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
  const isPhone = (value) => /^[0-9]{10}$/.test(value);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const validatePhone = (phone) => {
      const phoneRegex = /^\d{10}$/;
      return phoneRegex.test(phone);
    };
    if (!emailOrPhone) {
      alert('Email or phone number is required.');
      return;
    }
    if (!validateEmail(emailOrPhone) && !validatePhone(emailOrPhone)) {
      alert('Please enter a valid email or phone number.');
      return;
    }
    if (isOtpSent && (!otp || otp.length !== 6)) {
      setOtpError('Please enter a valid 6-digit OTP.');
      return;
    }
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
            isPhone: validatePhone(emailOrPhone),
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
        email: emailOrPhone,
        inviteCode: userInfo.inviteCode,
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">Welcome to Altaneofin</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <AiOutlineClose size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center">
            <img
              src="/images/login.jpg"
              alt="Logo"
              className="w-96 mb-4"
            />
            {/* <h1 className="text-2xl font-bold">Sign Up</h1> */}
            <div className="mt-6 w-full">
              <AuthButtons onClose={onClose} />
              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-600">Or sign up with email</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <input
                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                type="email"
                placeholder="Enter your email"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
              />
              {userExists === false && isUserInfoVisible && (
                <>
                  <div className="mb-4 mt-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={userInfo.name}
                      onChange={handleUserInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <fieldset className="mb-4">
                    <legend className="block text-sm font-medium text-gray-700">Gender</legend>
                    <div className="flex space-x-4 mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={userInfo.gender === "Male"}
                          onChange={handleUserInfoChange}
                          className="text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2">Male</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={userInfo.gender === "Female"}
                          onChange={handleUserInfoChange}
                          className="text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2">Female</span>
                      </label>
                    </div>
                  </fieldset>

                  <div className="mb-4">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={userInfo.phone}
                      onChange={handleUserInfoChange}
                      maxLength="10"
                      pattern="[0-9]*"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    />
                    <p className="mt-2 text-sm text-gray-500">Enter a valid 10-digit phone number.</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Invite Code</label>
                    <input
                      type="text"
                      name="inviteCode"
                      placeholder="Invite Code"
                      value={userInfo.inviteCode}
                      onChange={handleUserInfoChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveUserAndSendOtp}
                    className="w-full mt-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800">
                    Send OTP
                  </button>
                </>
              )}

              {isOtpSent && (
                <input
                  className="w-full px-4 py-2 mt-4 border rounded-lg focus:outline-none focus:border-purple-500"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}
              {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}

              <button onClick={handleSubmit} fullWidth className="w-full mt-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
              >
                Continue
              </button>

              <p className="mt-6 text-sm text-gray-600 text-center">
                By signing up, you agree to our
                <a href="#" className="text-purple-500 underline ml-1">
                  Terms of Service
                </a>
                and
                <a href="#" className="text-purple-500 underline ml-1">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
