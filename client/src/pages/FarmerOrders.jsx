import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function FarmerOrders() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] =
    useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "farmer") {
      navigate("/dashboard");
      return;
    }

    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/orders/farmer",
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
            "Failed to fetch orders"
        );
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      setProcessingId(orderId);

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
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
        alert(
          data.message ||
            "Failed to update order"
        );
        return;
      }

      fetchOrders();
    } catch (error) {
      alert(
        "Unable to connect to server"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const updateDelivery = async (
    orderId,
    deliveryStatus
  ) => {
    try {
      setProcessingId(orderId);

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/delivery-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deliveryStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update delivery status"
        );
        return;
      }

      fetchOrders();
    } catch (error) {
      alert(
        "Unable to connect to server"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-yellow-100 text-yellow-700";

      case "ready":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-green-200 text-green-800";

      case "cancelled":
        return "bg-red-100 text-red-700";

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
          Farmer Orders
        </h2>

        <p className="text-gray-600 mt-2 mb-8">
          Manage orders created from accepted reservations.
        </p>

        {loading && (
          <p className="text-gray-600">
            Loading orders...
          </p>
        )}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center">

              <h3 className="text-2xl font-bold text-gray-700">
                No orders yet
              </h3>

              <p className="text-gray-500 mt-2">
                Accepted buyer reservations will appear here.
              </p>

            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="text-2xl font-bold text-green-700">
                    {order.crop?.cropName ||
                      "Crop"}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Order
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              </div>

              <div className="mt-6 bg-green-50 rounded-xl p-5">

                <h4 className="font-bold text-gray-800 mb-3">
                  Order Details
                </h4>

                <div className="space-y-2 text-gray-700">

                  <p>
                    <strong>Quantity:</strong>{" "}
                    {order.quantity}{" "}
                    {order.crop?.unit}
                  </p>

                  <p>
                    <strong>Price / Unit:</strong>{" "}
                    ₹{order.pricePerUnit}
                  </p>

                  <p>
                    <strong>Total:</strong>{" "}
                    ₹{order.totalAmount}
                  </p>

                </div>

              </div>

              {order.buyer && (
                <div className="mt-5 bg-gray-50 rounded-xl p-5">

                  <h4 className="font-bold text-gray-800 mb-3">
                    Buyer
                  </h4>

                  <div className="space-y-2 text-gray-700">

                    <p>
                      <strong>Name:</strong>{" "}
                      {order.buyer.name}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {order.buyer.email}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {order.buyer.phone}
                    </p>

                    {order.buyer.location && (
                      <p>
                        <strong>Location:</strong>{" "}
                        {order.buyer.location}
                      </p>
                    )}

                  </div>

                </div>
              )}

              {/* ORDER STATUS */}
              {order.status !==
                "cancelled" &&
                order.status !==
                  "completed" && (
                  <div className="mt-6">

                    <p className="font-bold text-gray-800 mb-3">
                      Update Order
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {order.status ===
                        "confirmed" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "processing"
                            )
                          }
                          disabled={
                            processingId ===
                            order._id
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                          Processing
                        </button>
                      )}

                      {order.status ===
                        "processing" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "ready"
                            )
                          }
                          disabled={
                            processingId ===
                            order._id
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                          Mark Ready
                        </button>
                      )}

                      {order.status ===
                        "ready" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              order._id,
                              "completed"
                            )
                          }
                          disabled={
                            processingId ===
                            order._id
                          }
                          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                          Complete Order
                        </button>
                      )}

                    </div>

                  </div>
                )}

              {/* DELIVERY */}
              {order.status !==
                "cancelled" && (
                <div className="mt-6">

                  <p className="font-bold text-gray-800 mb-3">
                    Delivery
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {order.deliveryStatus ===
                      "not_started" && (
                      <button
                        onClick={() =>
                          updateDelivery(
                            order._id,
                            "pending"
                          )
                        }
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        Start Delivery
                      </button>
                    )}

                    {order.deliveryStatus ===
                      "pending" && (
                      <button
                        onClick={() =>
                          updateDelivery(
                            order._id,
                            "in_transit"
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        Mark In Transit
                      </button>
                    )}

                    {order.deliveryStatus ===
                      "in_transit" && (
                      <button
                        onClick={() =>
                          updateDelivery(
                            order._id,
                            "delivered"
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {order.status !== "cancelled" &&
  order.status !== "completed" && (
    <button
      onClick={() =>
        navigate(
          `/request-transport/${order._id}`
        )
      }
      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
    >
      Request Transport
    </button>
)}

                  </div>

                </div>
              )}

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default FarmerOrders;