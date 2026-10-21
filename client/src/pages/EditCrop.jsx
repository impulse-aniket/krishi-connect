import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EditCrop() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    unit: "kg",
    expectedPrice: "",
    harvestDate: "",
    location: "",
    description: "",
    status: "available",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Get crop
  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/crops/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Crop not found");
          setLoading(false);
          return;
        }

        setFormData({
          cropName: data.cropName || "",
          quantity: data.quantity || "",
          unit: data.unit || "kg",
          expectedPrice: data.expectedPrice || "",
          harvestDate: data.harvestDate
            ? data.harvestDate.split("T")[0]
            : "",
          location: data.location || "",
          description: data.description || "",
          status: data.status || "available",
        });

        setLoading(false);
      } catch (error) {
        setError("Unable to connect to server");
        setLoading(false);
      }
    };

    if (token && user && user.role === "farmer") {
      fetchCrop();
    }
  }, [id, token, user]);

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
    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/crops/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update crop");
        setSaving(false);
        return;
      }

      setMessage("Crop updated successfully!");

      setTimeout(() => {
        navigate("/my-crops");
      }, 1000);

    } catch (error) {
      setError("Unable to connect to server");
    }

    setSaving(false);
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <button
          onClick={() => navigate("/login")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (user.role !== "farmer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">

        <div className="bg-white p-8 rounded-xl shadow text-center">

          <h2 className="text-2xl font-bold text-red-600">
            Access Denied
          </h2>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-5 bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Dashboard
          </button>

        </div>

      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-600 text-lg">
          Loading crop...
        </p>
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
          onClick={() => navigate("/my-crops")}
          className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
        >
          My Crops
        </button>

      </nav>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-6 py-10">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-3xl font-bold text-green-700 mb-2">
            Edit Crop
          </h2>

          <p className="text-gray-500 mb-8">
            Update your crop listing details.
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
                value={formData.cropName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

              <div>

                <label className="block text-gray-700 font-medium mb-2">
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="quintal">Quintal</option>
                  <option value="ton">Ton</option>
                </select>

              </div>

            </div>

            {/* Price */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Expected Price
              </label>

              <input
                type="number"
                name="expectedPrice"
                value={formData.expectedPrice}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />

            </div>

            {/* Harvest Date */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Harvest Date
              </label>

              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />

            </div>

            {/* Location */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />

            </div>

            {/* Status */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="available">
                  Available
                </option>

                <option value="reserved">
                  Reserved
                </option>

                <option value="sold">
                  Sold
                </option>
              </select>

            </div>

            {/* Description */}
            <div className="mb-6">

              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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

            {/* Buttons */}
            <div className="flex gap-4">

              <button
                type="button"
                onClick={() => navigate("/my-crops")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default EditCrop;