import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to load notifications"
        );
        return;
      }

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-gray-600">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Notifications
            </h1>

            <p className="text-gray-600 mt-2">
              {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Dashboard
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
            {error}
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              No Notifications
            </h2>

            <p className="text-gray-500 mt-2">
              Your notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-xl shadow p-5 border ${
                  notification.isRead
                    ? "bg-white border-gray-200"
                    : "bg-green-100 border-green-400"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-gray-800">
                        {notification.title}
                      </h2>

                      {!notification.isRead && (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mt-2">
                      {notification.message}
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div>
                      <button
                        onClick={() =>
                          markAsRead(notification._id)
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Mark as Read
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;