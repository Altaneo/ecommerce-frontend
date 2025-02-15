import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const ProfileLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row mt-24 bg-purple-50 min-h-screen">
      <div className="relative md:hidden flex justify-between items-center p-4 bg-white shadow-md border-b border-purple-800">
        <h2 className="text-lg font-bold text-purple-600">Profile</h2>
        <button
          className="text-purple-600 text-2xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>
      
      <div
        className={`bg-white text-black p-4 shadow-md w-64 border border-purple-800 md:relative md:mt-5 md:max-h-[250vh] overflow-y-auto md:sticky md:top-4 md:flex md:flex-col transition-transform duration-300 z-0
          ${
            isSidebarOpen ? "relative top-full left-0 w-full" : "hidden md:flex"
          }
        `}
      >
        <h2 className="text-lg font-bold text-purple-600 mb-4 text-center">
          Profile
        </h2>
        <hr className="border-purple-800 mb-2" />
        <div className="mb-8">
          <img
            src="/images/sideImage.png"
            alt="Sidebar Banner"
            className="w-50 h-50 max-w-80% rounded-lg"
          />
        </div>
        <nav className="flex flex-col gap-2">
          {[
            { to: "/profile/user-details", label: "User Details" },
            { to: "/profile/my-orders", label: "My Orders" },
            { to: "/profile/notifications", label: "Notifications" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative p-2 rounded transition-colors duration-200 ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-purple-600 hover:bg-purple-100"
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
