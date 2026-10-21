import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function FarmerRequests() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "farmer") {
      navigate("/dashboard");
      return;
    }

    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/reservations/farmer",
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
            "Failed to fetch reservation requests"
        );
        return;
      }

      setReservations(data.reservations || []);
    } catch (error) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    reservationId,
    status
  ) => {
    try {
      setProcessingId(reservationId);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/reservations/${reservationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to update reservation"
        );
        return;
      }

      await fetchRequests();
    } catch (error) {
      setError("Unable to connect to server");
    } finally {
      setProcessingId(null);
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

      {/* NAVBAR */}
      <nav className="bg-green-700 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <h1
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-bold cursor-pointer"
          >
            Krishi-Connect
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
          >
            Dashboard
          </button>

        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-8">

          <h2 className="text-4xl font-bold text-green-800">
            Buyer Requests
          </h2>

          <p className="text-gray-600 mt-2">
            Review and manage reservation requests from buyers.
          </p>

        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-gray-600">
              Loading reservation requests...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <p className="text-red-600 font-medium">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          reservations.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center">

              <h3 className="text-2xl font-bold text-gray-700">
                No reservation requests
              </h3>

              <p className="text-gray-500 mt-2">
                Buyer requests for your crops will appear here.
              </p>

            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {reservations.map((reservation) => (

            <div
              key={reservation._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              {/* HEADER */}
              <div className="flex justify-between items-start gap-4">

                <div>
                  <h3 className="text-2xl font-bold text-green-700">
                    {reservation.crop?.cropName ||
                      "Crop"}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Reservation Request
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                    reservation.status
                  )}`}
                >
                  {reservation.status}
                </span>

              </div>

              {/* CROP DETAILS */}
              <div className="mt-6 bg-green-50 rounded-xl p-5">

                <h4 className="font-bold text-gray-800 mb-3">
                  Crop Details
                </h4>

                <div className="space-y-2 text-gray-700">

                  <p>
                    <strong>Quantity Requested:</strong>{" "}
                    {reservation.quantity}{" "}
                    {reservation.crop?.unit}
                  </p>

                  <p>
                    <strong>Expected Price:</strong>{" "}
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

                </div>

              </div>

              {/* BUYER DETAILS */}
              <div className="mt-5 bg-gray-50 rounded-xl p-5">

                <h4 className="font-bold text-gray-800 mb-3">
                  Buyer Details
                </h4>

                {reservation.buyer && (
                  <div className="space-y-2 text-gray-700">

                    <p>
                      <strong>Name:</strong>{" "}
                      {reservation.buyer.name}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {reservation.buyer.email}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {reservation.buyer.phone}
                    </p>

                    {reservation.buyer.location && (
                      <p>
                        <strong>Location:</strong>{" "}
                        {reservation.buyer.location}
                      </p>
                    )}

                  </div>
                )}

              </div>

              {/* MESSAGE */}
              {reservation.message && (
                <div className="mt-5">

                  <h4 className="font-bold text-gray-800">
                    Buyer Message
                  </h4>

                  <p className="text-gray-600 mt-2">
                    {reservation.message}
                  </p>

                </div>
              )}

              {/* ACTIONS */}
              {reservation.status === "pending" && (
                <div className="flex gap-4 mt-6">

                  <button
                    onClick={() =>
                      updateStatus(
                        reservation._id,
                        "accepted"
                      )
                    }
                    disabled={
                      processingId ===
                      reservation._id
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
                  >
                    {processingId ===
                    reservation._id
                      ? "Processing..."
                      : "Accept"}
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        reservation._id,
                        "rejected"
                      )
                    }
                    disabled={
                      processingId ===
                      reservation._id
                    }
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
                  >
                    {processingId ===
                    reservation._id
                      ? "Processing..."
                      : "Reject"}
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

export default FarmerRequests;