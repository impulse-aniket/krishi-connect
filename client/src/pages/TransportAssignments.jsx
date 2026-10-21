import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function TransportAssignments() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState([]);

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

    fetchAssignments();
  }, [user]);

  const fetchAssignments =
    async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/transport/assignments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (response.ok) {
          setRequests(
            data.requests || []
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  const updateStatus = async (
    id,
    deliveryStatus
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/transport/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deliveryStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update status"
        );
        return;
      }

      fetchAssignments();
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
          Transport Assignments
        </h2>

        <p className="text-gray-600 mt-2 mb-8">
          Manage your active deliveries.
        </p>

        {requests.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <h3 className="text-xl font-bold">
              No assignments
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
                {request.vehicle?.vehicleNumber}
              </h3>

              <div className="mt-5 space-y-2 text-gray-700">

                <p>
                  <strong>Farmer:</strong>{" "}
                  {request.farmer?.name}
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
                  <strong>Quantity:</strong>{" "}
                  {request.quantity}{" "}
                  {request.unit}
                </p>

              </div>

              <div className="mt-6">

                <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full capitalize font-semibold">
                  {request.deliveryStatus.replace(
                    "_",
                    " "
                  )}
                </span>

              </div>

              <div className="mt-6">

                {request.deliveryStatus ===
                  "pickup_pending" && (
                  <button
                    onClick={() =>
                      updateStatus(
                        request._id,
                        "picked_up"
                      )
                    }
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Mark Picked Up
                  </button>
                )}

                {request.deliveryStatus ===
                  "picked_up" && (
                  <button
                    onClick={() =>
                      updateStatus(
                        request._id,
                        "in_transit"
                      )
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Start Transit
                  </button>
                )}

                {request.deliveryStatus ===
                  "in_transit" && (
                  <button
                    onClick={() =>
                      updateStatus(
                        request._id,
                        "delivered"
                      )
                    }
                    className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold"
                  >
                    Mark Delivered
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default TransportAssignments;