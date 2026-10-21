import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !token) {
      return;
    }

    if (user.role !== "admin") {
      navigate("/dashboard", {
        replace: true,
      });
      return;
    }

    fetchAdminData();
  }, [user, token]);

  const fetchAdminData = async () => {
    try {
      const statsResponse = await fetch(
        "http://localhost:5000/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const statsData = await statsResponse.json();

      if (!statsResponse.ok) {
        setError(
          statsData.message ||
            "Unable to load admin statistics"
        );
        return;
      }

      setStats(statsData);

      const usersResponse = await fetch(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const usersData = await usersResponse.json();

      if (usersResponse.ok) {
        setUsers(usersData.users || []);
      }
    } catch (error) {
      console.error("Admin Dashboard Error:", error);

      setError(
        "Unable to connect to the server"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (user.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-gray-600">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Admin Dashboard
            </h1>

            <p className="text-gray-600 mt-1">
              Manage and monitor Krishi-Connect
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700"
          >
            Main Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">
                Total Users
              </p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                {stats.totalUsers}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">
                Farmers
              </p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                {stats.farmers}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">
                Buyers
              </p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                {stats.buyers}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">
                Storage Owners
              </p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                {stats.storageOwners}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">
                Transport Providers
              </p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                {stats.transportProviders}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">
                Crop Listings
              </p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                {stats.totalCrops}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">
                Orders
              </p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                {stats.totalOrders}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">
                Transport Requests
              </p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                {stats.totalTransportRequests}
              </h2>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="p-5 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              Registered Users
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4">
                      Name
                    </th>

                    <th className="text-left p-4">
                      Email
                    </th>

                    <th className="text-left p-4">
                      Role
                    </th>

                    <th className="text-left p-4">
                      Location
                    </th>

                    <th className="text-left p-4">
                      Phone
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((userItem) => (
                    <tr
                      key={userItem._id}
                      className="border-t"
                    >
                      <td className="p-4">
                        {userItem.name}
                      </td>

                      <td className="p-4">
                        {userItem.email}
                      </td>

                      <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {userItem.role}
                        </span>
                      </td>

                      <td className="p-4">
                        {userItem.location || "-"}
                      </td>

                      <td className="p-4">
                        {userItem.phone || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;