import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyColdStorage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [storage, setStorage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "coldStorageOwner") {
      navigate("/dashboard");
      return;
    }

    fetchStorage();
  }, [user]);

  const fetchStorage = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/cold-storage/my-storage",
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
            "Failed to fetch storage"
        );
        return;
      }

      setStorage(data.storage || []);
    } catch (error) {
      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
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

        <div className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-4xl font-bold text-green-800">
              My Cold Storage
            </h2>

            <p className="text-gray-600 mt-2">
              Manage your storage facilities.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/add-cold-storage")
            }
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            Add Storage
          </button>

        </div>

        {loading && (
          <p>Loading storage...</p>
        )}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          storage.length === 0 && (
            <div className="bg-white p-10 rounded-2xl shadow text-center">
              <h3 className="text-xl font-bold">
                No storage facilities
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first cold storage facility.
              </p>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {storage.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <div className="flex justify-between">

                <h3 className="text-2xl font-bold text-green-700">
                  {item.name}
                </h3>

                <span className="capitalize bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {item.status}
                </span>

              </div>

              <div className="mt-5 space-y-2 text-gray-700">

                <p>
                  <strong>Location:</strong>{" "}
                  {item.location}
                </p>

                <p>
                  <strong>Capacity:</strong>{" "}
                  {item.capacity} {item.unit}
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

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default MyColdStorage;