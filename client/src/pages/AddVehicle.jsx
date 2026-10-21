import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AddVehicle() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "truck",
    capacity: "",
    unit: "kg",
    location: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // No logged-in user
    if (!user || !token) {
      return;
    }

    // Logged-in user but wrong role
    if (user.role !== "transportProvider") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, token, navigate]);

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

    if (!token) {
      setError(
        "Authentication token not found. Please login again."
      );
      return;
    }

    if (!user) {
      setError(
        "User information not found. Please login again."
      );
      return;
    }

    if (user.role !== "transportProvider") {
      setError(
        "Only transport providers can add vehicles."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/vehicles",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            vehicleNumber: formData.vehicleNumber,
            vehicleType: formData.vehicleType,
            capacity: Number(formData.capacity),
            unit: formData.unit,
            location: formData.location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to add vehicle"
        );
        return;
      }

      setMessage(
        "Vehicle added successfully!"
      );

      setFormData({
        vehicleNumber: "",
        vehicleType: "truck",
        capacity: "",
        unit: "kg",
        location: "",
      });
    } catch (error) {
      console.error(
        "Add Vehicle Error:",
        error
      );

      setError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    }
  };

  /*
    If authentication data has not loaded,
    show a simple loading message instead of
    immediately redirecting to login.
  */
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-xl font-bold text-green-700">
            Loading...
          </h2>

          <p className="text-gray-600 mt-2">
            Checking your authentication.
          </p>
        </div>
      </div>
    );
  }

  // Wrong role
  if (user.role !== "transportProvider") {
    return null;
  }

  return (
    <div className="min-h-screen bg-green-50">

      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">

          <h1
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-bold cursor-pointer"
          >
            Krishi-Connect
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Dashboard
          </button>

        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-10">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-3xl font-bold text-green-700">
            Add Vehicle
          </h2>

          <p className="text-gray-600 mt-2 mb-8">
            Register a vehicle for agricultural transportation.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Vehicle Number */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Vehicle Number
              </label>

              <input
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g. MH05AB1234"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Vehicle Type
              </label>

              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="truck">
                  Truck
                </option>

                <option value="mini-truck">
                  Mini Truck
                </option>

                <option value="tempo">
                  Tempo
                </option>

                <option value="tractor">
                  Tractor
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* Capacity and Unit */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Capacity
                </label>

                <input
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Capacity"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Unit
                </label>

                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="kg">
                    kg
                  </option>

                  <option value="quintal">
                    Quintal
                  </option>

                  <option value="ton">
                    Ton
                  </option>
                </select>
              </div>

            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Current Location
              </label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter current location"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            {/* Add Vehicle */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Add Vehicle
            </button>

            {/* My Vehicles */}
            <button
              type="button"
              onClick={() =>
                navigate("/my-vehicles")
              }
              className="w-full border border-green-600 text-green-700 hover:bg-green-50 py-3 rounded-lg font-semibold transition"
            >
              View My Vehicles
            </button>

          </form>

        </div>

      </main>
    </div>
  );
}

export default AddVehicle;