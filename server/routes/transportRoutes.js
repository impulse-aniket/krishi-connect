const express = require("express");

const {
  createTransportRequest,
  getFarmerTransportRequests,
  getProviderRequests,
  getProviderAssignments,
  acceptTransportRequest,
  rejectTransportRequest,
  updateTransportStatus,
} = require("../controllers/transportController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  createTransportRequest
);

router.get(
  "/farmer",
  protect,
  getFarmerTransportRequests
);

router.get(
  "/provider",
  protect,
  getProviderRequests
);

router.get(
  "/assignments",
  protect,
  getProviderAssignments
);

router.put(
  "/:id/accept",
  protect,
  acceptTransportRequest
);

router.put(
  "/:id/reject",
  protect,
  rejectTransportRequest
);

router.put(
  "/:id/status",
  protect,
  updateTransportStatus
);

module.exports = router;