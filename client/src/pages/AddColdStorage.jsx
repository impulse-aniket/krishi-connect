import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AddColdStorage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    unit: "kg",
    pricePerUnit: "",
    temperature: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.role !== "coldStorageOwner") {
    navigate("/dashboard");
    return null;
  }

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

    try {
      const response = await fetch(
        "http://localhost:5000/api/cold-storage",
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
        setError(
          data.message ||
            "Failed to add cold storage"
        );
        return;
      }

      setMessage(
        "Cold storage added successfully!"
      );

      setFormData({
        name: "",
        location: "",
        capacity: "",
        unit: "kg",
        pricePerUnit: "",
        temperature: "",
        description: "",
      });
    } catch (error) {
      setError(
        "Unable to connect to server"
      );
    }
  };

  return (
    <div className="min-h-screen bg-green-50">

      <nav className="bg-green-700 text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">

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

      <main className="max-w-3xl mx-auto px-6 py-10">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-3xl font-bold text-green-700">
            Add Cold Storage
          </h2>

          <p className="text-gray-600 mt-2 mb-8">
            Register your cold storage facility.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Storage Name"
              required
              className="w-full px-4 py-3 border rounded-lg"
            />

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              required
              className="w-full px-4 py-3 border rounded-lg"
            />

            <div className="grid grid-cols-2 gap-4">

              <input
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Capacity"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="kg">kg</option>
                <option value="quintal">
                  Quintal
                </option>
                <option value="ton">
                  Ton
                </option>
              </select>

            </div>

            <input
              name="pricePerUnit"
              type="number"
              min="0"
              value={formData.pricePerUnit}
              onChange={handleChange}
              placeholder="Price per unit"
              required
              className="w-full px-4 py-3 border rounded-lg"
            />

            <input
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="Temperature (e.g. 4°C)"
              className="w-full px-4 py-3 border rounded-lg"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows="4"
              className="w-full px-4 py-3 border rounded-lg"
            />

            {error && (
              <p className="text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="text-green-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
            >
              Add Cold Storage
            </button>

          </form>

        </div>

      </main>
    </div>
  );
}

export default AddColdStorage;