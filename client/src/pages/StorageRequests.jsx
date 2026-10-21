import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function StorageRequests() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "coldStorageOwner") {
      navigate("/dashboard");
      return;
    }

    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/storage-bookings/owner",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookings(
          data.bookings || []
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/storage-bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update booking"
        );
        return;
      }

      fetchBookings();
    } catch (error) {
      alert(
        "Unable to connect to server"
      );
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-green-50">

      <nav className="bg-green-700 text-white px-6 py-4">

        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <h1
            onClick={() =>
              navigate("/dashboard")
            }
            className="text-2xl font-bold cursor-pointer"
          >
            Krishi-Connect
          </h1>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
          >
            Dashboard
          </button>

        </div>

      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-4xl font-bold text-green-800">
          Storage Requests
        </h2>

        <p className="text-gray-600 mt-2 mb-8">
          Manage farmer storage booking requests.
        </p>

        {loading && (
          <p>Loading requests...</p>
        )}

        {!loading &&
          bookings.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <h3 className="text-xl font-bold">
                No booking requests
              </h3>
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {bookings.map((booking) => (

            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <div className="flex justify-between">

                <h3 className="text-2xl font-bold text-green-700">
                  {booking.storage?.name}
                </h3>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full capitalize">
                  {booking.status}
                </span>

              </div>

              <div className="mt-6 bg-gray-50 rounded-xl p-5 space-y-2">

                <p>
                  <strong>Farmer:</strong>{" "}
                  {booking.farmer?.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {booking.farmer?.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {booking.farmer?.phone}
                </p>

                <p>
                  <strong>Quantity:</strong>{" "}
                  {booking.quantity}{" "}
                  {booking.storage?.unit}
                </p>

                <p>
                  <strong>Total:</strong>{" "}
                  ₹{booking.totalAmount}
                </p>

                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(
                    booking.startDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>End:</strong>{" "}
                  {new Date(
                    booking.endDate
                  ).toLocaleDateString()}
                </p>

              </div>

              {booking.status ===
                "pending" && (
                <div className="flex gap-4 mt-6">

                  <button
                    onClick={() =>
                      updateStatus(
                        booking._id,
                        "accepted"
                      )
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        booking._id,
                        "rejected"
                      )
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
                  >
                    Reject
                  </button>

                </div>
              )}

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default StorageRequests;