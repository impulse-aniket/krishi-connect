import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

function ColdStorageDetails() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [storage, setStorage] = useState(null);

  const [formData, setFormData] = useState({
    quantity: "",
    startDate: "",
    endDate: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] =
    useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchStorage();
  }, [user, id]);

  const fetchStorage = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cold-storage/${id}`,
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

      setStorage(data);
    } catch (error) {
      setError(
        "Unable to connect to server"
      );
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/storage-bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            storageId: id,
            quantity:
              Number(formData.quantity),
            startDate:
              formData.startDate,
            endDate:
              formData.endDate,
            notes:
              formData.notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to create booking"
        );
        return;
      }

      setMessage(
        "Storage booking request created successfully!"
      );

      setFormData({
        quantity: "",
        startDate: "",
        endDate: "",
        notes: "",
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

  if (user.role !== "farmer") {
    return (
      <div className="min-h-screen bg-green-50 p-10 text-center">
        <p className="text-red-600">
          Only farmers can book cold storage.
        </p>
      </div>
    );
  }

  if (!storage) {
    return (
      <div className="min-h-screen bg-green-50 p-10 text-center">
        {error ? (
          <p className="text-red-600">
            {error}
          </p>
        ) : (
          <p>
            Loading storage...
          </p>
        )}
      </div>
    );
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
              navigate("/browse-cold-storage")
            }
            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
          >
            Back
          </button>

        </div>

      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-4xl font-bold text-green-700">
            {storage.name}
          </h2>

          <div className="mt-6 space-y-3 text-gray-700">

            <p>
              <strong>Location:</strong>{" "}
              {storage.location}
            </p>

            <p>
              <strong>Capacity:</strong>{" "}
              {storage.capacity}{" "}
              {storage.unit}
            </p>

            <p>
              <strong>Available:</strong>{" "}
              {storage.availableCapacity}{" "}
              {storage.unit}
            </p>

            <p>
              <strong>Price:</strong>{" "}
              ₹{storage.pricePerUnit} /{" "}
              {storage.unit}
            </p>

            {storage.temperature && (
              <p>
                <strong>Temperature:</strong>{" "}
                {storage.temperature}
              </p>
            )}

          </div>

          <div className="border-t mt-8 pt-8">

            <h3 className="text-2xl font-bold text-gray-800">
              Book Storage
            </h3>

            <form
              onSubmit={handleBooking}
              className="mt-6 space-y-5"
            >

              <input
                name="quantity"
                type="number"
                min="1"
                max={storage.availableCapacity}
                value={formData.quantity}
                onChange={handleChange}
                placeholder={`Quantity in ${storage.unit}`}
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block mb-2 font-medium">
                    Start Date
                  </label>

                  <input
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    End Date
                  </label>

                  <input
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

              </div>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes"
                rows="4"
                className="w-full px-4 py-3 border rounded-lg"
              />

              {error && (
                <p className="text-red-600">
                  {error}
                </p>
              )}

              {message && (
                <p className="text-green-600 font-semibold">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold"
              >
                Request Storage Booking
              </button>

            </form>

          </div>

        </div>

      </main>
    </div>
  );
}

export default ColdStorageDetails;