import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <div className="flex mt-24 bg-purple-50">
      {/* Sidebar */}
      <div className="bg-white text-black p-4 rounded-lg shadow-md w-64 border border-purple-800 mt-2">
        <h2 className="text-lg font-bold text-purple-600 mb-4 text-center">Profile</h2>
        <hr className="border-purple-800 mb-2" />
        <div className="mb-8">
          <img
            src="/images/sideImage.png" // Replace with your image path
            alt="Sidebar Banner"
            className="w-full h-auto rounded-lg" // Adjust the class as needed
          />
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/profile/user-details"
            className={({ isActive }) =>
              `block p-2 rounded transition-colors duration-200 ${isActive ? "bg-purple-600 text-white" : "text-purple-600 hover:bg-purple-100"
              }`
            }
          >
            User Details
          </NavLink>
          <NavLink
            to="/profile/my-orders"
            className={({ isActive }) =>
              `block p-2 rounded transition-colors duration-200 ${isActive ? "bg-purple-600 text-white" : "text-purple-600 hover:bg-purple-100"
              }`
            }
          >
            My Orders
          </NavLink>
        </nav>
      </div>


      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
