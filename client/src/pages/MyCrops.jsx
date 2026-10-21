import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MyCrops() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyCrops = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/crops/my-crops",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch crops");
        setLoading(false);
        return;
      }

      setCrops(data.crops || []);
      setLoading(false);
    } catch (error) {
      setError("Unable to connect to server");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchMyCrops();
    }
  }, [token, user]);

  // Delete crop
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this crop?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/crops/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete crop");
        return;
      }

      alert("Crop deleted successfully");

      fetchMyCrops();
    } catch (error) {
      alert("Unable to connect to server");
    }
  };

  // Login check
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

  // Farmer check
  if (user.role !== "farmer") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">

          <h2 className="text-2xl font-bold text-red-600">
            Access Denied
          </h2>

          <p className="text-gray-600 mt-2">
            Only farmers can view crop listings.
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
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

          <div>
            <h2 className="text-3xl font-bold text-green-700">
              My Crop Listings
            </h2>

            <p className="text-gray-500 mt-2">
              Manage the crops you have listed.
            </p>
          </div>

          <button
            onClick={() => navigate("/add-crop")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            + Add Crop
          </button>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600">
              Loading your crops...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && crops.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center">

            <h3 className="text-xl font-semibold text-gray-700">
              No crop listings yet
            </h3>

            <p className="text-gray-500 mt-2">
              Start by adding your first crop.
            </p>

            <button
              onClick={() => navigate("/add-crop")}
              className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Add Your First Crop
            </button>

          </div>
        )}

        {/* Crop Cards */}
        {!loading && !error && crops.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {crops.map((crop) => (
              <div
                key={crop._id}
                className="bg-white rounded-xl shadow-md p-6"
              >

                {/* Header */}
                <div className="flex justify-between items-start gap-3 mb-4">

                  <h3 className="text-2xl font-bold text-green-700">
                    {crop.cropName}
                  </h3>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {crop.status}
                  </span>

                </div>

                {/* Details */}
                <div className="space-y-3 text-gray-600">

                  <p>
                    <strong>Quantity:</strong>{" "}
                    {crop.quantity} {crop.unit}
                  </p>

                  <p>
                    <strong>Expected Price:</strong>{" "}
                    ₹{crop.expectedPrice}
                  </p>

                  <p>
                    <strong>Harvest Date:</strong>{" "}
                    {new Date(
                      crop.harvestDate
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {crop.location}
                  </p>

                  {crop.description && (
                    <p>
                      <strong>Description:</strong>{" "}
                      {crop.description}
                    </p>
                  )}

                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() =>
                      navigate(`/edit-crop/${crop._id}`)
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(crop._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default MyCrops;