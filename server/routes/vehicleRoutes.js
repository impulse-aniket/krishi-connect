const express = require("express");

const {
  addVehicle,
  getMyVehicles,
  getAvailableVehicles,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getAvailableVehicles
);

router.get(
  "/my-vehicles",
  protect,
  getMyVehicles
);

router.post(
  "/",
  protect,
  addVehicle
);

router.put(
  "/:id",
  protect,
  updateVehicle
);

router.delete(
  "/:id",
  protect,
  deleteVehicle
);

module.exports = router;