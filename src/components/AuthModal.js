import React, { useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import AuthButtons from "./AuthButtons";
import { useTranslation } from "react-i18next";

function AuthModal({ open, onClose, authType }) {
  const { t } = useTranslation();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    gender: "",
    email: "",
    inviteCode: "",
  });
  axios.defaults.withCredentials = true;
  const [userExists, setUserExists] = useState(null);
  const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);
  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
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
      alert(`${t("ALERT_EMAIL_OR_PHONE_REQUIRED")}`);
      return;
    }
    if (!validateEmail(emailOrPhone) && !validatePhone(emailOrPhone)) {
      alert(`${t("ALERT_INVALID_EMAIL_OR_PHONE")}`);
      return;
    }
    if (isOtpSent && (!otp || otp.length !== 6)) {
      setOtpError(`${t("ALERT_INVALID_OTP")}`);
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
          const otpResponse = await axios.post(
            `${apiBaseUrl}/api/auth/send-otp`,
            {
              emailOrPhone,
              isPhone: validatePhone(emailOrPhone),
            }
          );

          if (otpResponse.status === 200) {
            setIsOtpSent(true);
          } else {
            alert(`${t("ALERT_INVALID_OTP")}`);
          }
        } else {
          setUserExists(false);
          setIsUserInfoVisible(true);
        }
      } catch (error) {
        alert(`${t("ALERT_OTP_SENT_FAILED")}`);
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/auth/verify-otp`, {
          emailOrPhone,
          otp,
        });

        if (response.data.success) {
          console.log(`${authType} ${t("YOUTUBE_REDIRECT_MESSAGE")}`);
          window.location.href = `${apiBaseUrl}/auth/youtube`;
          onClose();
        } else {
          setOtpError(response.data.message || `${t("INVALID_OTP")}`);
        }
      } catch (error) {
        setOtpError(`${t("ALERT_OTP_VERIFICATION_ERROR")}`);
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
        phone: userInfo.phone,
        role: userInfo.role,
        profilePicture: userInfo.profilePicture,
      };

      const saveUserResponse = await axios.post(
        `${apiBaseUrl}/api/auth/save-user`,
        userInfoData
      );
      if (saveUserResponse.status === 201) {
        alert(`${t("USER_SAVED_AND_OTP_SENT")}`);
        const otpResponse = await axios.post(
          `${apiBaseUrl}/api/auth/send-otp`,
          {
            emailOrPhone,
            isPhone: isPhone(emailOrPhone),
          }
        );
        if (otpResponse.status === 200) {
          setIsOtpSent(true);
        } else {
          alert(`${t("FAILED")}`);
        }
      } else {
        alert(`${t("FAILED")}`);
      }
    } catch (error) {
      alert(`${t("ALERT_ERROR_SENDING_OTP")}`);
      console.error(error);
    }
  };

  if (!open) return null;

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePicture", file);

      try {
        const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          setUserInfo((prev) => ({
            ...prev,
            profilePicture: response.data.imageUrl, // Save the image URL
          }));
          alert(`${t("IMAGE_UPLODED")}`);
        } else {
          alert(`${t("FAILED_TO_UPLOAD")}`);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(`${t("FAILED_TO_UPLOAD")}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-lg w-full sm:w-96 md:w-1/2 lg:w-2/3 xl:w-1/2">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">{t("WELCOME_TO_ALTANEOFIN")}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh] p-4">
          <div className="flex items-center mb-4">
            <img
              src={`${apiBaseUrl}/uploads/login.jpg`}
              alt="Logo"
              className="w-full h-auto object-cover rounded-full"
            />
          </div>

          <div>
            <AuthButtons onClose={onClose} />
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-600">
                {t("OR_SIGN_UP_WITH_EMAIL")}
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500 mb-4"
              type="email"
              placeholder={t("ENTER_YOUR_EMAIL")}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
            {userExists === false && isUserInfoVisible && (
              <div className="p-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("PROFILE_PICTURE")}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                </div>
                <div className="mb-4 mt-4">
                  <input
                    type="text"
                    name="name"
                    placeholder={t("FULL_NAME")}
                    value={userInfo.name}
                    onChange={handleUserInfoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <fieldset className="mb-4">
                  <legend className="block text-sm font-medium text-gray-700">
                    {t("ROLE")}
                  </legend>
                  <div className="flex space-x-4 mt-2">
                    {["influencer", "customer", "admin"].map((role) => (
                      <label key={role} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={userInfo.role === role}
                          onChange={handleUserInfoChange}
                          className="text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2">
                          {t(`ROLE_${role.toUpperCase()}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="mb-4">
                  <legend className="block text-sm font-medium text-gray-700">
                    {t("GENDER")}
                  </legend>
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
                      <span className="ml-2">{t("MALE")}</span>
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
                      <span className="ml-2">{t("FEMALE")}</span>
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
                  <p className="mt-2 text-sm text-gray-500">
                    {t("ENTER_VALID_PHONE")}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("INVITE_CODE")}
                  </label>
                  <input
                    type="text"
                    name="inviteCode"
                    placeholder={t("INVITE_CODE")}
                    value={userInfo.inviteCode}
                    onChange={handleUserInfoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={handleSaveUserAndSendOtp}
                  className="w-full mt-2 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
                >
                  {t("SEND_OTP")}
                </button>
              </div>
            )}
            {isOtpSent && (
              <input
                className="w-full px-4 py-2 mt-4 border rounded-lg focus:outline-none focus:border-purple-500"
                type="text"
                placeholder={t("ENTER_OTP")}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            )}
            {otpError && (
              <p className="text-red-500 text-sm mt-2">{otpError}</p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full mt-4 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-purple-800"
            >
              {t("CONTINUE")}
            </button>

            <p className="mt-6 text-sm text-gray-600 text-center">
              {t("TERMS_AND_PRIVACY")}
              <a href="#" className="text-purple-500 underline ml-1">
                {t("TERMS_OF_SERVICES")}
              </a>
              {t("AND")}
              <a href="#" className="text-purple-500 underline ml-1">
                {t("PRIVACY_POLICY")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
