import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function CropDetails() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchCrop();
  }, [user, id]);

  const fetchCrop = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/crops/buyer/${id}`,
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
            "Failed to fetch crop"
        );
        return;
      }

      setCrop(data);
    } catch (error) {
      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    try {
      setMessage("");
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/reservations",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            cropId: crop._id,
            quantity: crop.quantity,
            message:
              "I would like to reserve this crop.",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to reserve crop"
        );
        return;
      }

      setMessage(
        "Crop reserved successfully!"
      );

      setCrop({
        ...crop,
        status: "reserved",
      });

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

      <nav className="bg-green-700 text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <h1
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-bold cursor-pointer"
          >
            Krishi-Connect
          </h1>

          <button
            onClick={() =>
              navigate("/browse-crops")
            }
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
          >
            Back to Crops
          </button>

        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {loading && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <p className="text-gray-600">
              Loading crop details...
            </p>
          </div>
        )}

        {error && !crop && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">

            <p className="text-red-600">
              {error}
            </p>

            <button
              onClick={() =>
                navigate("/browse-crops")
              }
              className="mt-5 bg-green-600 text-white px-5 py-3 rounded-lg"
            >
              Back to Crops
            </button>

          </div>
        )}

        {!loading && crop && (
          <div className="bg-white rounded-2xl shadow-lg p-8">

            <div className="flex flex-col md:flex-row justify-between gap-4">

              <div>
                <h2 className="text-4xl font-bold text-green-700">
                  {crop.cropName}
                </h2>

                <p className="text-gray-500 mt-2">
                  Crop Details
                </p>
              </div>

              <span
                className={`self-start px-4 py-2 rounded-full font-semibold capitalize ${
                  crop.status === "available"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {crop.status}
              </span>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

              <div className="bg-green-50 rounded-xl p-5">
                <p className="text-gray-500">
                  Quantity
                </p>

                <p className="text-xl font-bold text-gray-800 mt-1">
                  {crop.quantity} {crop.unit}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-5">
                <p className="text-gray-500">
                  Expected Price
                </p>

                <p className="text-xl font-bold text-gray-800 mt-1">
                  ₹{crop.expectedPrice}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-5">
                <p className="text-gray-500">
                  Location
                </p>

                <p className="text-xl font-bold text-gray-800 mt-1">
                  {crop.location}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-5">
                <p className="text-gray-500">
                  Harvest Date
                </p>

                <p className="text-xl font-bold text-gray-800 mt-1">
                  {new Date(
                    crop.harvestDate
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>

            {crop.farmer && (
              <div className="mt-8 border-t pt-8">

                <h3 className="text-2xl font-bold text-gray-800">
                  Farmer Information
                </h3>

                <div className="mt-4 space-y-2 text-gray-700">

                  <p>
                    <strong>Name:</strong>{" "}
                    {crop.farmer.name}
                  </p>

                  {crop.farmer.location && (
                    <p>
                      <strong>Location:</strong>{" "}
                      {crop.farmer.location}
                    </p>
                  )}

                </div>

              </div>
            )}

            {crop.description && (
              <div className="mt-8 border-t pt-8">

                <h3 className="text-2xl font-bold text-gray-800">
                  Description
                </h3>

                <p className="text-gray-600 mt-3">
                  {crop.description}
                </p>

              </div>
            )}

            {message && (
              <p className="text-green-600 font-semibold text-center mt-6">
                {message}
              </p>
            )}

            {error && crop && (
              <p className="text-red-600 font-semibold text-center mt-6">
                {error}
              </p>
            )}

            <button
              onClick={handleReserve}
              disabled={
                crop.status !== "available"
              }
              className={`w-full mt-8 py-4 rounded-xl text-lg font-bold text-white ${
                crop.status === "available"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {crop.status === "available"
                ? "Reserve This Crop"
                : "Crop Not Available"}
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default CropDetails;