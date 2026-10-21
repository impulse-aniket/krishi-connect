import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function BrowseColdStorage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [storage, setStorage] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchStorage();
  }, [user]);

  const fetchStorage = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/cold-storage",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStorage(data.storage || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStorage =
    storage.filter(
      (item) =>
        item.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.location
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

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
          Cold Storage
        </h2>

        <p className="text-gray-600 mt-2">
          Find available cold storage facilities.
        </p>

        <input
          type="text"
          placeholder="Search by storage name or location..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full md:w-1/2 mt-8 px-5 py-4 border rounded-xl"
        />

        {loading && (
          <p className="mt-8">
            Loading storage...
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

          {filteredStorage.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <h3 className="text-2xl font-bold text-green-700">
                {item.name}
              </h3>

              <div className="mt-4 space-y-2 text-gray-700">

                <p>
                  <strong>Location:</strong>{" "}
                  {item.location}
                </p>

                <p>
                  <strong>Available:</strong>{" "}
                  {item.availableCapacity}{" "}
                  {item.unit}
                </p>

                <p>
                  <strong>Price:</strong>{" "}
                  ₹{item.pricePerUnit} /{" "}
                  {item.unit}
                </p>

                {item.temperature && (
                  <p>
                    <strong>Temperature:</strong>{" "}
                    {item.temperature}
                  </p>
                )}

              </div>

              <button
                onClick={() =>
                  navigate(
                    `/cold-storage/${item._id}`
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

export default BrowseColdStorage;