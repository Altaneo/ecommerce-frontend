import { useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineWarning, AiOutlineCloseCircle, AiOutlineInfoCircle } from 'react-icons/ai'; // Example icons

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const apiBaseUrl =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/notifications`);
        const data = await response.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const getBadgeColor = (type) => {
    switch (type.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case "success":
        return <AiOutlineCheckCircle className="text-green-700" />;
      case "warning":
        return <AiOutlineWarning className="text-yellow-700" />;
      case "error":
        return <AiOutlineCloseCircle className="text-red-700" />;
      default:
        return <AiOutlineInfoCircle className="text-blue-700" />;
    }
  };

  return (
    <div className="bg-purple-50 min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-4xl mb-4 text-center font-bold text-black animate-slide-in">
        Notifications
      </h2>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-5 sm:p-6">
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`p-4 rounded-lg shadow-sm border transition-all transform hover:scale-105 ${
                  notif.read
                    ? "bg-gray-100 border-gray-300"
                    : "bg-white border-purple-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center">
                    {getIcon(notif.type)}
                    <h3 className="text-lg font-semibold text-gray-800 ml-2">
                      {notif.title}
                    </h3>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                    {new Date(notif.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 mt-2 text-sm">{notif.message}</p>
                <div className="mt-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                      notif.type
                    )}`}
                  >
                    {notif.type}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
