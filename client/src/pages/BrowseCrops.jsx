import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function BrowseCrops() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchCrops();
  }, [user]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/crops",
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
            "Failed to fetch crops"
        );
        return;
      }

      setCrops(data.crops || []);
    } catch (error) {
      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter(
    (crop) =>
      crop.cropName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      crop.location
        .toLowerCase()
        .includes(search.toLowerCase())
  );

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
              navigate("/dashboard")
            }
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
          >
            Dashboard
          </button>

        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-8">

          <h2 className="text-4xl font-bold text-green-800">
            Browse Crops
          </h2>

          <p className="text-gray-600 mt-2">
            Find crops available from farmers.
          </p>

        </div>

        {/* SEARCH */}
        <div className="mb-8">

          <input
            type="text"
            placeholder="Search crop or location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full md:w-1/2 px-5 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />

        </div>

        {loading && (
          <p className="text-gray-600">
            Loading crops...
          </p>
        )}

        {error && (
          <p className="text-red-600 mb-5">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          filteredCrops.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center">

              <h3 className="text-xl font-semibold text-gray-700">
                No crops available
              </h3>

              <p className="text-gray-500 mt-2">
                No crops match your search.
              </p>

            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredCrops.map((crop) => (

            <div
              key={crop._id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >

              <div className="flex justify-between items-start">

                <h3 className="text-2xl font-bold text-green-700">
                  {crop.cropName}
                </h3>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {crop.status}
                </span>

              </div>

              <div className="mt-5 space-y-2 text-gray-700">

                <p>
                  <strong>Quantity:</strong>{" "}
                  {crop.quantity} {crop.unit}
                </p>

                <p>
                  <strong>Expected Price:</strong>{" "}
                  ₹{crop.expectedPrice}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {crop.location}
                </p>

                <p>
                  <strong>Harvest Date:</strong>{" "}
                  {new Date(
                    crop.harvestDate
                  ).toLocaleDateString()}
                </p>

                {crop.farmer && (
                  <p>
                    <strong>Farmer:</strong>{" "}
                    {crop.farmer.name}
                  </p>
                )}

              </div>

              {crop.description && (
                <p className="text-gray-600 mt-4">
                  {crop.description}
                </p>
              )}

              <button
                onClick={() =>
                  navigate(
                    `/crop/${crop._id}`
                  )
                }
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
              >
                View Details
              </button>

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default BrowseCrops;