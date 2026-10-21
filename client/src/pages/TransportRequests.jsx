import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function TransportRequests() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState([]);

  const [vehicles, setVehicles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (
      user.role !==
      "transportProvider"
    ) {
      navigate("/dashboard");
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [
        requestsResponse,
        vehiclesResponse,
      ] = await Promise.all([
        fetch(
          "http://localhost:5000/api/transport/provider",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

        fetch(
          "http://localhost:5000/api/vehicles/my-vehicles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      const requestData =
        await requestsResponse.json();

      const vehicleData =
        await vehiclesResponse.json();

      if (requestsResponse.ok) {
        setRequests(
          requestData.requests || []
        );
      }

      if (vehiclesResponse.ok) {
        setVehicles(
          vehicleData.vehicles || []
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (
    requestId
  ) => {
    const vehicleId =
      document.getElementById(
        `vehicle-${requestId}`
      ).value;

    if (!vehicleId) {
      alert(
        "Please select a vehicle"
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/transport/${requestId}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vehicleId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to accept request"
        );
        return;
      }

      fetchData();
    } catch (error) {
      alert(
        "Unable to connect to server"
      );
    }
  };

  const rejectRequest = async (
    requestId
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/transport/${requestId}/reject`,
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
            "Failed to reject request"
        );
        return;
      }

      fetchData();
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
          Transport Requests
        </h2>

        <p className="text-gray-600 mt-2 mb-8">
          Accept transport requests and assign vehicles.
        </p>

        {loading && (
          <p>Loading requests...</p>
        )}

        {!loading &&
          requests.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <h3 className="text-xl font-bold">
                No pending requests
              </h3>
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {requests.map((request) => (

            <div
              key={request._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <h3 className="text-2xl font-bold text-green-700">
                Transport Request
              </h3>

              <div className="mt-5 space-y-2 text-gray-700">

                <p>
                  <strong>Farmer:</strong>{" "}
                  {request.farmer?.name}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {request.farmer?.phone}
                </p>

                <p>
                  <strong>Quantity:</strong>{" "}
                  {request.quantity}{" "}
                  {request.unit}
                </p>

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

              </div>

              <select
                id={`vehicle-${request._id}`}
                className="w-full mt-6 px-4 py-3 border rounded-lg"
              >

                <option value="">
                  Select Vehicle
                </option>

                {vehicles
                  .filter(
                    (vehicle) =>
                      vehicle.status ===
                      "available"
                  )
                  .map((vehicle) => (
                    <option
                      key={vehicle._id}
                      value={vehicle._id}
                    >
                      {vehicle.vehicleNumber} -{" "}
                      {vehicle.vehicleType} -{" "}
                      {vehicle.capacity}{" "}
                      {vehicle.unit}
                    </option>
                  ))}

              </select>

              <div className="flex gap-4 mt-5">

                <button
                  onClick={() =>
                    acceptRequest(
                      request._id
                    )
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    rejectRequest(
                      request._id
                    )
                  }
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
                >
                  Reject
                </button>

              </div>

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default TransportRequests;