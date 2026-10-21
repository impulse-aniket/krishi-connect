import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyVehicles() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [vehicles, setVehicles] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (
      user.role !==
      "transportProvider"
    ) {
      navigate("/dashboard");
      return;
    }

    fetchVehicles();
  }, [user]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/vehicles/my-vehicles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setVehicles(
          data.vehicles || []
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (id) => {
    if (
      !window.confirm(
        "Delete this vehicle?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/vehicles/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete vehicle"
        );
        return;
      }

      fetchVehicles();
    } catch (error) {
      alert(
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
              My Vehicles
            </h2>

            <p className="text-gray-600 mt-2">
              Manage your transport vehicles.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/add-vehicle")
            }
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            Add Vehicle
          </button>

        </div>

        {loading && (
          <p>Loading vehicles...</p>
        )}

        {!loading &&
          vehicles.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <h3 className="text-xl font-bold">
                No vehicles
              </h3>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {vehicles.map((vehicle) => (

            <div
              key={vehicle._id}
              className="bg-white rounded-2xl shadow-md p-6"
            >

              <div className="flex justify-between">

                <h3 className="text-2xl font-bold text-green-700">
                  {vehicle.vehicleNumber}
                </h3>

                <span className="capitalize bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {vehicle.status}
                </span>

              </div>

              <div className="mt-5 space-y-2 text-gray-700">

                <p>
                  <strong>Type:</strong>{" "}
                  {vehicle.vehicleType}
                </p>

                <p>
                  <strong>Capacity:</strong>{" "}
                  {vehicle.capacity}{" "}
                  {vehicle.unit}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {vehicle.location}
                </p>

              </div>

              <button
                onClick={() =>
                  deleteVehicle(
                    vehicle._id
                  )
                }
                disabled={
                  vehicle.status ===
                  "busy"
                }
                className="w-full mt-6 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
              >
                Delete Vehicle
              </button>

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default MyVehicles;