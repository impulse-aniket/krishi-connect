const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const cropRoutes = require("./routes/cropRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const orderRoutes = require("./routes/orderRoutes");

const coldStorageRoutes = require(
  "./routes/coldStorageRoutes"
);

const storageBookingRoutes = require(
  "./routes/storageBookingRoutes"
);

const vehicleRoutes = require(
  "./routes/vehicleRoutes"
);

const transportRoutes = require(
  "./routes/transportRoutes"
);

const marketPriceRoutes = require(
  "./routes/marketPriceRoutes"
);

const notificationRoutes = require(
  "./routes/notificationRoutes"
);

const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/crops",
  cropRoutes
);

app.use(
  "/api/reservations",
  reservationRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/cold-storage",
  coldStorageRoutes
);

app.use(
  "/api/storage-bookings",
  storageBookingRoutes
);

app.use(
  "/api/vehicles",
  vehicleRoutes
);

app.use(
  "/api/transport",
  transportRoutes
);

app.use(
  "/api/market-prices",
  marketPriceRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    message:
      "Krishi-Connect API is running",
  });
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Krishi-Connect server running on port ${PORT}`
  );
});