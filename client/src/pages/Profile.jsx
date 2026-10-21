import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { token, user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Get profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Failed to load profile"
          );
          setLoading(false);
          return;
        }

        const profile = data.user;

        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          role: profile.role || "",
        });

        setLoading(false);
      } catch (error) {
        setError("Unable to connect to server");
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            location: formData.location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to update profile"
        );
        setSaving(false);
        return;
      }

      // Update AuthContext and localStorage
      login(data.user, token);

      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        location: data.user.location || "",
        role: data.user.role || "",
      });

      setMessage("Profile updated successfully!");

      setSaving(false);
    } catch (error) {
      setError("Unable to connect to server");
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">

        <p className="text-gray-600 text-lg">
          Loading profile...
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
          onClick={() => navigate("/dashboard")}
          className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-100"
        >
          Dashboard
        </button>

      </nav>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-6 py-10">

        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-3xl font-bold text-green-700">
            My Profile
          </h2>

          <p className="text-gray-500 mt-2 mb-8">
            View and update your account information.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* Email */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>

              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
              />

              <p className="text-sm text-gray-400 mt-1">
                Email cannot be changed.
              </p>

            </div>

            {/* Phone */}
            <div className="mb-5">

              <label className="block text-gray-700 font-medium mb-2">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                placeholder="Example: Kalyan, Maharashtra"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* Role */}
            <div className="mb-6">

              <label className="block text-gray-700 font-medium mb-2">
                Role
              </label>

              <input
                type="text"
                value={formData.role}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
              />

              <p className="text-sm text-gray-400 mt-1">
                Role is assigned during registration.
              </p>

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

            {/* Save */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg"
            >
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default Profile;