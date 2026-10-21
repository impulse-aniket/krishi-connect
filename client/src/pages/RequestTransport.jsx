import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

function RequestTransport() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] =
    useState(null);

  const [formData, setFormData] =
    useState({
      pickupLocation: "",
      deliveryLocation: "",
      requestedDate: "",
      transportCost: "",
      notes: "",
    });

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "farmer") {
      navigate("/dashboard");
      return;
    }

    fetchOrder();
  }, [user, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
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
            "Failed to fetch order"
        );
        return;
      }

      setOrder(data.order);

      setFormData((previous) => ({
        ...previous,
        pickupLocation:
          data.order.crop?.location ||
          "",
      }));
    } catch (error) {
      setError(
        "Unable to connect to server"
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/transport",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId,
            ...formData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to create transport request"
        );
        return;
      }

      setMessage(
        "Transport request created successfully!"
      );

    } catch (error) {
      setError(
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
        <div className="max-w-5xl mx-auto flex justify-between items-center">

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
              navigate("/farmer-orders")
            }
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
          >
            Back to Orders
          </button>

        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">

        {order && (
          <div className="bg-white rounded-2xl shadow-md p-8">

            <h2 className="text-3xl font-bold text-green-700">
              Request Transport
            </h2>

            <div className="bg-green-50 rounded-xl p-5 mt-6">

              <p>
                <strong>Crop:</strong>{" "}
                {order.crop?.cropName}
              </p>

              <p className="mt-2">
                <strong>Quantity:</strong>{" "}
                {order.quantity}{" "}
                {order.crop?.unit}
              </p>

              <p className="mt-2">
                <strong>Buyer:</strong>{" "}
                {order.buyer?.name}
              </p>

              <p className="mt-2">
                <strong>Buyer Location:</strong>{" "}
                {order.buyer?.location ||
                  "Not provided"}
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 mt-8"
            >

              <input
                name="pickupLocation"
                value={
                  formData.pickupLocation
                }
                onChange={handleChange}
                placeholder="Pickup Location"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <input
                name="deliveryLocation"
                value={
                  formData.deliveryLocation
                }
                onChange={handleChange}
                placeholder="Delivery Location"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <div>
                <label className="block font-medium mb-2">
                  Requested Date
                </label>

                <input
                  name="requestedDate"
                  type="date"
                  value={
                    formData.requestedDate
                  }
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              <input
                name="transportCost"
                type="number"
                min="0"
                value={
                  formData.transportCost
                }
                onChange={handleChange}
                placeholder="Estimated Transport Cost"
                className="w-full px-4 py-3 border rounded-lg"
              />

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes"
                rows="4"
                className="w-full px-4 py-3 border rounded-lg"
              />

              {error && (
                <p className="text-red-600">
                  {error}
                </p>
              )}

              {message && (
                <p className="text-green-600 font-semibold">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold"
              >
                Request Transport
              </button>

            </form>

          </div>
        )}

      </main>
    </div>
  );
}

export default RequestTransport;