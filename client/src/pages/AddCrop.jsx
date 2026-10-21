import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AddCrop() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    unit: "kg",
    expectedPrice: "",
    harvestDate: "",
    location: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/crops",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to add crop");
        setLoading(false);
        return;
      }

      setMessage("Crop listed successfully!");

      // Clear form
      setFormData({
        cropName: "",
        quantity: "",
        unit: "kg",
        expectedPrice: "",
        harvestDate: "",
        location: "",
        description: "",
      });

      setLoading(false);

    } catch (error) {
      setError("Unable to connect to server");
      setLoading(false);
    }
  };

  // Check login
  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Please login first
          </h2>

          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Only farmers can add crops
  if (user.role !== "farmer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">

          <h2 className="text-2xl font-bold text-red-600">
            Access Denied
          </h2>

          <p className="text-gray-600 mt-2">
            Only farmers can add crop listings.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">

      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Krishi-Connect
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-100"
        >
          Dashboard
        </button>

      </nav>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-6 py-10">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-3xl font-bold text-green-700 mb-2">
            Add Crop Listing
          </h2>

          <p className="text-gray-500 mb-8">
            List your crop so buyers can discover and reserve it.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Crop Name */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Crop Name
              </label>

              <input
                type="text"
                name="cropName"
                placeholder="Example: Tomato"
                value={formData.cropName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* Quantity + Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  placeholder="Example: 500"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>

              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Unit
                </label>

                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="quintal">Quintal</option>
                  <option value="ton">Ton</option>
                </select>

              </div>

            </div>

            {/* Expected Price */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Expected Price
              </label>

              <input
                type="number"
                name="expectedPrice"
                placeholder="Price per selected unit"
                value={formData.expectedPrice}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* Harvest Date */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Expected Harvest Date
              </label>

              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* Location */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Farm Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="Example: Kalyan, Maharashtra"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* Description */}
            <div className="mb-6">

              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Enter additional details about your crop..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-center mb-4">
                {error}
              </p>
            )}

            {/* Success */}
            {message && (
              <p className="text-green-600 text-center mb-4">
                {message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition"
            >
              {loading ? "Adding Crop..." : "Add Crop Listing"}
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AddCrop;