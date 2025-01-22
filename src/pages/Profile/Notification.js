import { useEffect, useState } from "react";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
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

    return (
        <div className="bg-purple-50 min-h-screen p-6">
            <h2 className="text-4xl mb-3 flex justify-center font-bold text-black animate-slide-in whitespace-nowrap">

                Notifications
            </h2>
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <ul className="space-y-4">
                    {notifications.map((notif) => (
                        <li
                            key={notif.id}
                            className={`p-4 rounded-lg shadow-sm border ${notif.read ? "bg-gray-100 border-gray-300" : "bg-pruple-50 border-purple-300"
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800">{notif.title}</h3>
                                <span className="text-sm text-gray-500">
                                    {new Date(notif.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-700 mt-2">{notif.message}</p>
                            <div className="mt-3">
                                {notif.type === "promo" && (
                                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                                        Promo
                                    </span>
                                )}
                                {notif.type === "order" && (
                                    <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 rounded-full">
                                        Order
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Notifications;
