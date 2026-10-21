import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "buyer") {
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
        "http://localhost:5000/api/orders/buyer",
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

  const cancelOrder = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "cancelled",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to cancel order"
        );
        return;
      }

      fetchOrders();
    } catch (error) {
      alert(
        "Unable to connect to server"
      );
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

  const getDeliveryStyle = (status) => {
    switch (status) {
      case "in_transit":
        return "bg-blue-100 text-blue-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

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
          My Orders
        </h2>

        <p className="text-gray-600 mt-2 mb-8">
          Track your confirmed crop orders.
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
                Accepted reservations will appear here as orders.
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

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <div className="flex justify-between items-start gap-3">

                <h3 className="text-2xl font-bold text-green-700">
                  {order.crop?.cropName ||
                    "Crop"}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              </div>

              <div className="mt-5 space-y-2 text-gray-700">

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
                  <strong>Total Amount:</strong>{" "}
                  ₹{order.totalAmount}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {order.crop?.location}
                </p>

                {order.farmer && (
                  <p>
                    <strong>Farmer:</strong>{" "}
                    {order.farmer.name}
                  </p>
                )}

              </div>

              <div className="mt-5 pt-5 border-t">

                <p className="text-gray-500 text-sm">
                  Delivery Status
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getDeliveryStyle(
                    order.deliveryStatus
                  )}`}
                >
                  {order.deliveryStatus.replace(
                    "_",
                    " "
                  )}
                </span>

              </div>

              {[
                "confirmed",
                "processing",
                "ready",
              ].includes(order.status) && (
                <button
                  onClick={() =>
                    cancelOrder(order._id)
                  }
                  className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
                >
                  Cancel Order
                </button>
              )}

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default MyOrders;