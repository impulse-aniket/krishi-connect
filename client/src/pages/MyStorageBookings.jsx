import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyStorageBookings() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "farmer") {
      navigate("/dashboard");
      return;
    }

    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/storage-bookings/farmer",
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

  const cancelBooking = async (id) => {
    const confirmed = window.confirm(
      "Cancel this storage booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/storage-bookings/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to cancel booking"
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
          My Storage Bookings
        </h2>

        <p className="text-gray-600 mt-2 mb-8">
          Track your cold storage requests.
        </p>

        {loading && (
          <p>Loading bookings...</p>
        )}

        {!loading &&
          bookings.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <h3 className="text-xl font-bold">
                No storage bookings
              </h3>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {bookings.map((booking) => (

            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <h3 className="text-2xl font-bold text-green-700">
                {booking.storage?.name}
              </h3>

              <div className="mt-5 space-y-2 text-gray-700">

                <p>
                  <strong>Location:</strong>{" "}
                  {booking.storage?.location}
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

              <span className="inline-block mt-5 px-3 py-1 rounded-full bg-green-100 text-green-700 capitalize font-semibold">
                {booking.status}
              </span>

              {[
                "pending",
                "accepted",
              ].includes(booking.status) && (
                <button
                  onClick={() =>
                    cancelBooking(
                      booking._id
                    )
                  }
                  className="w-full mt-5 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
                >
                  Cancel Booking
                </button>
              )}

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default MyStorageBookings;