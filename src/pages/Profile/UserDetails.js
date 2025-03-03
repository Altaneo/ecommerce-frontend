import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UserDetails = () => {
  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const { t ,i18n} = useTranslation();
  const currentLang = i18n.language || "en";
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [success, setSuccess] = useState("");
  const [addressData, setAddressData] = useState({
    pincode: "",
    locality: "",
    streetAddress: "",
    city: "",
    state: "",
    landmark: "",
    alternatePhone: "",
    addressType: "Home",
  });
  const fetchUserDataRef = useRef(false);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch user data
  const fetchUserData = async () => {
    if (fetchUserDataRef.current) return; // Prevent fetching if already fetching
    fetchUserDataRef.current = true;
    try {
      const response = await axios.get(`${apiBaseUrl}/api/auth/profile`, {
        withCredentials: true,
      });
      setUserData(response.data.user);
      if (
        response.data.user.addresses &&
        response.data.user.addresses.length > 0
      ) {
        setAddressData(response.data.user.addresses[0]);
      } else {
        setAddressData({
          pincode: "",
          locality: "",
          streetAddress: "",
          city: "",
          state: "",
          landmark: "",
          alternatePhone: "",
          addressType: "Home",
        });
      }
    } catch (error) {
      setError(t("FAILED_TO_FETCH_USER"));
    } finally {
      fetchUserDataRef.current = false;
    }
  };
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
          setImage(response.data.imageUrl);
          setUserData((prev) => ({
            ...prev,
            profilePicture: image, // Save the image URL
          }));
          alert(t("IMAGE_UPLOADED"));
        } else {
          alert(t("FAILED_TO_UPLOADED"));
        }
      } catch (error) {
        alert(t("FAILED_TO_UPLOADED"));
      }
    }
  };
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
          bio: userData.bio,
          gender: userData.gender,
          role: userData.role,
          email: userData.email,
          phone: userData.phone,
          profilePicture: image,
          addresses: [addressData],
        },
        { withCredentials: true }
      );
      setSuccess(t("PROFILE_UPDATE_SUCCESS"));
      setUserData(response.data.user);
      setIsEditing(false);
    } catch (error) {
      setError(t("FAILED_TO_UPDATE_PROFILE"));
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
    <>
      <h2 className="text-4xl mt-4 mb-2 flex justify-center font-bold text-black animate-slide-in whitespace-nowrap">
        {t("USER_DEATILS")}
      </h2>
      <div className="flex mt-4 items-center justify-center  bg-purple-50 p-5">
        <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
          {!loading ? (
            <>
              <div className="space-y-5">
                {isEditing ? (
                  <>
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={userData.name || ""}
                        onChange={handleChange}
                        placeholder={t("FULL_NAME")}
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="bio"
                        value={userData.bio || ""}
                        onChange={handleChange}
                        placeholder={t("BIO")}
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">{t("GENDER")}</label>
                      <div className="flex space-x-4">
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={userData.gender === "Male"}
                            onChange={handleChange}
                          />
                          {t("MALE")}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={userData.gender === "Female"}
                            onChange={handleChange}
                          />
                          {t("FEMALE")}
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2">{t("ROLE")}</label>
                      <div className="flex space-x-4">
                        <label>
                          <input
                            type="radio"
                            name="role"
                            value="influencer"
                            checked={userData.role === "influencer"}
                            onChange={handleChange}
                          />
                          {t("INFLUENCER")}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="role"
                            value="customer"
                            checked={userData.role === "customer"}
                            onChange={handleChange}
                          />
                          {t("CUSTOMER")}
                        </label>
                      </div>
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={userData.email || ""}
                        onChange={handleChange}
                        placeholder={t("EMAIL_ADDRESS")}
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="phone"
                        value={userData.phone || ""}
                        onChange={handleChange}
                        placeholder={t("PHONE")}
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                        maxLength="10"
                      />
                    </div>
                    <label className="block mb-2">{t("PROFILE_PICTURE")}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                    />
                    <div>
                      <input
                        type="number"
                        name="pincode"
                        value={addressData.pincode}
                        onChange={handleAddressChange}
                        placeholder={t("PINCODE")}
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="locality"
                        value={addressData.locality}
                        onChange={handleAddressChange}
                        placeholder={t("LOCALITY")}
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="streetAddress"
                        value={addressData.streetAddress}
                        onChange={handleAddressChange}
                        placeholder={t("ADDRESS")}
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="city"
                        value={addressData.city}
                        onChange={handleAddressChange}
                        placeholder={t("CITY")}
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="state"
                        value={addressData.state}
                        onChange={handleAddressChange}
                        placeholder={t("STATE")}
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="landmark"
                        value={addressData.landmark}
                        onChange={handleAddressChange}
                        placeholder={t("LANDMARK")}
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">{t("ADDRESS_TYPE")}</label>
                      <div className="flex space-x-4">
                        <label>
                          <input
                            type="radio"
                            name="addressType"
                            value="Home"
                            checked={addressData.addressType === "Home"}
                            onChange={handleAddressChange}
                          />
                          {t("HOME")}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="addressType"
                            value="Work"
                            checked={addressData.addressType === "Work"}
                            onChange={handleAddressChange}
                          />
                          {t("WORK")}
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div class="bg-white overflow-hidden shadow rounded-lg border">
                      <div class="px-4 py-5 sm:px-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">
                          {t("USER_PROFILE")}
                        </h3>
                        <p class="mt-1 max-w-2xl text-sm text-gray-500">
                          {t("USER_INFO")}
                        </p>
                      </div>
                      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl class="sm:divide-y sm:divide-gray-200">
                          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              {t("FULL_NAME")}:{" "}
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {userData.name || "N/A"}
                            </dd>
                          </div>
                          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              {t("EMAIL_ADDRESS")}:
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {userData.email || "N/A"}
                            </dd>
                          </div>
                          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              {t("PHONE")}:
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {userData.phone || "N/A"}
                            </dd>
                          </div>
                          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              {t("GENDER")}:
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {userData.gender || "N/A"}
                            </dd>
                          </div>
                          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              {t("ROLE")}
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {userData.role || "N/A"}
                            </dd>
                          </div>
                          {addressData?.city && (
                            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt class="text-sm font-medium text-gray-500">
                                {t("ADDRESS")}
                              </dt>
                              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {userData.name}, {addressData.pincode} ,
                                {addressData.streetAddress},{" "}
                                {addressData.locality}, {addressData.city},{" "}
                                {addressData.state}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end mt-5">
                {isEditing ? (
                  <>
                    <button
                      className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                      onClick={handleSubmit}
                    >
                      {t("SAVE_CHANGES")}
                    </button>
                    <button
                      className="bg-gray-300 text-black px-4 py-2 rounded ml-2 hover:bg-gray-400"
                      onClick={() => setIsEditing(false)}
                    >
                      {t("CANCEL")}
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    onClick={() => setIsEditing(true)}
                  >
                    {t("EDIT_PROFILE")}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-screen">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetails;
