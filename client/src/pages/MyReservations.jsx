import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyReservations() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "buyer") {
      navigate("/dashboard");
      return;
    }

    fetchReservations();
  }, [user]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/reservations/buyer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to fetch reservations"
        );
        return;
      }

      setReservations(
        data.reservations || []
      );
    } catch (error) {
      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (
    reservationId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/reservations/${reservationId}/cancel`,
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
            "Failed to cancel reservation"
        );
        return;
      }

      fetchReservations();

    } catch (error) {
      alert(
        "Unable to connect to server"
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "accepted":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
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
          My Reservations
        </h2>

        <p className="text-gray-600 mt-2 mb-8">
          Track your crop reservation requests.
        </p>

        {loading && (
          <p className="text-gray-600">
            Loading reservations...
          </p>
        )}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          reservations.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center">

              <h3 className="text-xl font-bold text-gray-700">
                No reservations yet
              </h3>

              <p className="text-gray-500 mt-2">
                Browse available crops and reserve one.
              </p>

              <button
                onClick={() =>
                  navigate("/browse-crops")
                }
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Browse Crops
              </button>

            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {reservations.map(
            (reservation) => (
              <div
                key={reservation._id}
                className="bg-white rounded-2xl shadow-md p-6"
              >

                <div className="flex justify-between items-start">

                  <h3 className="text-2xl font-bold text-green-700">
                    {reservation.crop?.cropName ||
                      "Crop"}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>

                </div>

                <div className="mt-5 space-y-2 text-gray-700">

                  <p>
                    <strong>Quantity:</strong>{" "}
                    {reservation.quantity}{" "}
                    {reservation.crop?.unit}
                  </p>

                  <p>
                    <strong>Price:</strong>{" "}
                    ₹
                    {
                      reservation.crop
                        ?.expectedPrice
                    }
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {
                      reservation.crop
                        ?.location
                    }
                  </p>

                  {reservation.farmer && (
                    <p>
                      <strong>Farmer:</strong>{" "}
                      {
                        reservation.farmer.name
                      }
                    </p>
                  )}

                </div>

                {reservation.status ===
                  "pending" && (
                  <button
                    onClick={() =>
                      cancelReservation(
                        reservation._id
                      )
                    }
                    className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
                  >
                    Cancel Reservation
                  </button>
                )}

              </div>
            )
          )}

        </div>

      </main>
    </div>
  );
}

export default MyReservations;