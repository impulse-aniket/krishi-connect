
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import AddCrop from "./pages/AddCrop";
import MyCrops from "./pages/MyCrops";
import EditCrop from "./pages/EditCrop";
import BrowseCrops from "./pages/BrowseCrops";
import CropDetails from "./pages/CropDetails";

import MyReservations from "./pages/MyReservations";
import FarmerRequests from "./pages/FarmerRequests";
import MyOrders from "./pages/MyOrders";
import FarmerOrders from "./pages/FarmerOrders";

import AddColdStorage from "./pages/AddColdStorage";
import MyColdStorage from "./pages/MyColdStorage";
import BrowseColdStorage from "./pages/BrowseColdStorage";
import ColdStorageDetails from "./pages/ColdStorageDetails";
import MyStorageBookings from "./pages/MyStorageBookings";
import StorageRequests from "./pages/StorageRequests";

import AddVehicle from "./pages/AddVehicle";
import MyVehicles from "./pages/MyVehicles";
import RequestTransport from "./pages/RequestTransport";
import MyTransportRequests from "./pages/MyTransportRequests";
import TransportRequests from "./pages/TransportRequests";
import TransportAssignments from "./pages/TransportAssignments";

import Weather from "./pages/Weather";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Common */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Farmer - crops */}
        <Route path="/add-crop" element={<AddCrop />} />
        <Route path="/my-crops" element={<MyCrops />} />
        <Route path="/edit-crop/:id" element={<EditCrop />} />

        {/* Buyer - crops */}
        <Route path="/browse-crops" element={<BrowseCrops />} />
        <Route path="/crop/:id" element={<CropDetails />} />

        {/* Reservations */}
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/farmer-requests" element={<FarmerRequests />} />

        {/* Orders */}
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/farmer-orders" element={<FarmerOrders />} />

        {/* Cold storage */}
        <Route path="/add-cold-storage" element={<AddColdStorage />} />
        <Route path="/my-cold-storage" element={<MyColdStorage />} />
        <Route path="/browse-cold-storage" element={<BrowseColdStorage />} />
        <Route path="/cold-storage/:id" element={<ColdStorageDetails />} />
        <Route path="/my-storage-bookings" element={<MyStorageBookings />} />
        <Route path="/storage-requests" element={<StorageRequests />} />

        {/* Transport */}
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/my-vehicles" element={<MyVehicles />} />
        <Route
          path="/request-transport/:orderId"
          element={<RequestTransport />}
        />
        <Route
          path="/my-transport-requests"
          element={<MyTransportRequests />}
        />
        <Route path="/transport-requests" element={<TransportRequests />} />
        <Route
          path="/transport-assignments"
          element={<TransportAssignments />}
        />

        {/* Agricultural information */}
        <Route path="/weather" element={<Weather />} />
        <Route
          path="/government-schemes"
          element={<GovernmentSchemes />}
        />
      

        {/* Notifications and administration */}
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
