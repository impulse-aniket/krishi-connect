import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyTransportRequests() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

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
      const response = await fetch(
        "http://localhost:5000/api/transport/farmer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRequests(
          data.requests || []
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
          My Transport Requests
        </h2>

        <p className="text-gray-600 mt-2 mb-8">
          Track transportation for your orders.
        </p>

        {loading && (
          <p>Loading requests...</p>
        )}

        {!loading &&
          requests.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <h3 className="text-xl font-bold">
                No transport requests
              </h3>

              <p className="text-gray-500 mt-2">
                Request transport from your orders.
              </p>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {requests.map((request) => (

            <div
              key={request._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <h3 className="text-2xl font-bold text-green-700">
                {request.order?.quantity}{" "}
                {request.unit}
              </h3>

              <div className="mt-5 space-y-2 text-gray-700">

                <p>
                  <strong>Pickup:</strong>{" "}
                  {request.pickupLocation}
                </p>

                <p>
                  <strong>Delivery:</strong>{" "}
                  {request.deliveryLocation}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    request.requestedDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>Cost:</strong>{" "}
                  ₹{request.transportCost}
                </p>

                {request.provider && (
                  <p>
                    <strong>Provider:</strong>{" "}
                    {request.provider.name}
                  </p>
                )}

                {request.vehicle && (
                  <p>
                    <strong>Vehicle:</strong>{" "}
                    {request.vehicle.vehicleNumber}
                  </p>
                )}

              </div>

              <div className="flex gap-3 mt-6">

                <span className="bg-green-100 text-green-700 px-3 py-2 rounded-full capitalize font-semibold">
                  {request.status}
                </span>

                <span className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full capitalize font-semibold">
                  {request.deliveryStatus.replace(
                    "_",
                    " "
                  )}
                </span>

              </div>

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default MyTransportRequests;