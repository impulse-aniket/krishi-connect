
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MarketPrices() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();

    async function fetchPrices() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/market-prices",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load market prices"
          );
        }

        setPrices(data.prices || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to connect to the server");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPrices();

    return () => controller.abort();
  }, [user, token, navigate]);

  const filteredPrices = prices
    .filter((item) => {
      const query = search.trim().toLowerCase();
      const locationQuery = locationFilter.trim().toLowerCase();

      const matchesSearch =
        !query ||
        item.cropName?.toLowerCase().includes(query) ||
        item.market?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query);

      const matchesLocation =
        !locationQuery ||
        item.location?.toLowerCase().includes(locationQuery);

      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;

      return new Date(b.date || b.createdAt || 0) -
        new Date(a.date || a.createdAt || 0);
    });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-green-50">
      <nav className="bg-green-700 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Krishi-Connect
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-green-800">
          Agricultural Market Prices
        </h2>

        <p className="text-gray-600 mt-2 mb-6">
          Browse recorded market prices by crop and location.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop or market..."
            className="bg-white border rounded-lg px-4 py-3"
          />

          <input
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter by location..."
            className="bg-white border rounded-lg px-4 py-3"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white border rounded-lg px-4 py-3"
          >
            <option value="latest">Latest first</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>

        {loading && (
          <p className="text-gray-600">Loading market prices...</p>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg p-4 mb-5">
            {error}
          </div>
        )}

        {!loading && !error && filteredPrices.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold">No market prices found</h3>
            <p className="text-gray-600 mt-2">
              No records match your filters, or no prices have been added yet.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrices.map((item) => (
            <article
              key={item._id}
              className="bg-white rounded-xl shadow p-6 border border-green-100"
            >
              <h3 className="text-xl font-bold text-green-700">
                {item.cropName}
              </h3>

              <p className="text-gray-600 mt-2">
                Market: {item.market}
              </p>

              <p className="text-gray-600">
                Location: {item.location}
              </p>

              <p className="text-2xl font-bold mt-4">
                ₹{Number(item.price).toLocaleString("en-IN")}
                <span className="text-sm font-normal text-gray-500">
                  {" "}/ {item.unit || "unit"}
                </span>
              </p>

              <p className="text-sm text-gray-500 mt-3">
                Date: {item.date
                  ? new Date(item.date).toLocaleDateString()
                  : "Not specified"}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default MarketPrices;
