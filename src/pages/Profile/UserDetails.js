import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const UserDetails = () => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
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
      if (response.data.user.addresses && response.data.user.addresses.length > 0) {
        setAddressData(response.data.user.addresses[0]);
      } else {
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
      setError("Failed to fetch user data.");
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
        const response = await axios.post(
          `${apiBaseUrl}/upload`, 
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
  
        if (response.data.success) {
          setImage(response.data.imageUrl)
          setUserData((prev) => ({
            ...prev,
            profilePicture: image, // Save the image URL
          }));
          alert("Image uploaded successfully!");
        } else {
          alert("Failed to upload image.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image.");
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
          bio:userData.bio,
          gender: userData.gender,
          role: userData.role,
          email: userData.email,
          phone: userData.phone,
          profilePicture:image,
          addresses: [addressData],
        },
        { withCredentials: true }
      );
      setSuccess("Profile updated successfully!");
      setUserData(response.data.user);
      setIsEditing(false);
    } catch (error) {
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
    <>
      <h2 className="text-4xl mt-4 mb-2 flex justify-center font-bold text-black animate-slide-in whitespace-nowrap">

        User Details
      </h2>
      <div className="flex mt-4 items-center justify-center  bg-purple-50 p-5">

        <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">


          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-purple-500">{success}</p>}

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
                        placeholder="First Name"
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="bio"
                        value={userData.bio || ""}
                        onChange={handleChange}
                        placeholder="Bio"
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Gender</label>
                      <div className="flex space-x-4">
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={userData.gender === "Male"}
                            onChange={handleChange}
                          />
                          Male
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={userData.gender === "Female"}
                            onChange={handleChange}
                          />
                          Female
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2">Role</label>
                      <div className="flex space-x-4">
                        <label>
                          <input
                            type="radio"
                            name="role"
                            value="influencer"
                            checked={userData.role === "influencer"}
                            onChange={handleChange}
                          />
                          influencer
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="role"
                            value="customer"
                            checked={userData.role === "customer"}
                            onChange={handleChange}
                          />
                          Customer
                        </label>
                      </div>
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={userData.email || ""}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="phone"
                        value={userData.phone || ""}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                        maxLength="10"
                      />
                    </div>
                    <label className="block mb-2">Profile Picture</label>
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
                        placeholder="Pincode"
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
                        placeholder="Locality"
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
                        placeholder="Address (Area and Street)"
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
                        placeholder="City/District/Town"
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
                        placeholder="State"
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
                        placeholder="Landmark (Optional)"
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="alternatePhone"
                        value={addressData.alternatePhone}
                        onChange={handleAddressChange}
                        placeholder="Alternate Phone (Optional)"
                        className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-purple-500"
                        maxLength="10"
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Address Type</label>
                      <div className="flex space-x-4">
                        <label>
                          <input
                            type="radio"
                            name="addressType"
                            value="Home"
                            checked={addressData.addressType === "Home"}
                            onChange={handleAddressChange}
                          />
                          Home
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="addressType"
                            value="Work"
                            checked={addressData.addressType === "Work"}
                            onChange={handleAddressChange}
                          />
                          Work
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div class="bg-white overflow-hidden shadow rounded-lg border">
                      <div class="px-4 py-5 sm:px-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">
                          User Profile
                        </h3>
                        <p class="mt-1 max-w-2xl text-sm text-gray-500">
                          This is some information about the user.
                        </p>
                      </div>
                      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl class="sm:divide-y sm:divide-gray-200">
                          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              Full name
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {userData.name || "N/A"}
                            </dd>
                          </div>
                          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              Email address
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {userData.email || "N/A"}
                            </dd>
                          </div>
                          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              Phone number
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {userData.phone || "N/A"}
                            </dd>
                          </div>
                          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              Gender:
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {userData.gender || "N/A"}
                            </dd>
                          </div>
                          <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500">
                              Role:
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {userData.role || "N/A"}
                            </dd>
                          </div>
                          {addressData?.city && (
                            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt class="text-sm font-medium text-gray-500">
                                Address
                              </dt>
                              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">

                                {userData.name}, {addressData.pincode} ,{addressData.streetAddress}, {addressData.locality}, {addressData.city}, {addressData.state}
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
                      Save Changes
                    </button>
                    <button
                      className="bg-gray-300 text-black px-4 py-2 rounded ml-2 hover:bg-gray-400"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetails;
