import { useState, useEffect } from "react";
import api from "../lib/api";
import { FaBell } from "react-icons/fa";
const NotificationWidget = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Initialize loading as true

    // Fetch notifications from the server using the custom api module
    const fetchNotifications = async () => {
        try {
            const { data, error } = await api.get('/events/notifications');
            console.log(data)

            if (error) {
                console.error("Error fetching notifications:", error);
                setLoading(false);
                return;
            }

            setNotifications(data); // Set the notifications to the state
            setLoading(false); // Set loading to false once data is loaded
        } catch (error) {
            console.error("Failed to fetch notifications", error);
            setLoading(false); // Set loading to false in case of error as well
        }
    };

    const clearNotifications = async () => {
        setNotifications([]);
        try {
            const response = await api.post('/events/notifications/clear');
        } catch (error) {
            console.error("Failed to clear notifications", error);
        }
    };
    // Toggle the notification dropdown
    const toggleNotifications = () => {
        setIsOpen(!isOpen);
    };

    // Fetch notifications on mount & every 30 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            <button onClick={toggleNotifications} className="p-2 relative">
            <FaBell size={24} color="black" /> {/* Black bell icon */}
                {notifications.length > 0 && (
                    <span
                        className="absolute top-0 right-0 text-xs px-1 rounded-full"
                        style={{
                            backgroundColor: "red",  // Red background for number
                            color: "white",  // White text for contrast
                            fontSize: "12px",
                            fontWeight: "bold",
                            padding: "2px 6px"
                        }}
                    >
                        {notifications.length}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg p-2">
                    {loading ? (
                        <div className="p-2 text-gray-500">Loading...</div> // Show loading text while fetching data
                    ) : notifications.length > 0 ? (
                        notifications.map((n, index) => (
                            <div key={index} className="p-2 border-b">
                                {n.message}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500">No new notifications</div>
                    )}
                    <button
                        onClick={clearNotifications}
                        className="w-full mt-2 bg-red-500 text-white py-1 rounded"
                    >
                        Clear All Notifications
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationWidget;