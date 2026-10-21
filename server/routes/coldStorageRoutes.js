const express = require("express");

const {
  addColdStorage,
  getMyStorage,
  getAvailableStorage,
  getStorageById,
  updateColdStorage,
  deleteColdStorage,
} = require("../controllers/coldStorageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getAvailableStorage
);

router.get(
  "/my-storage",
  protect,
  getMyStorage
);

router.get(
  "/:id",
  protect,
  getStorageById
);

router.post(
  "/",
  protect,
  addColdStorage
);

router.put(
  "/:id",
  protect,
  updateColdStorage
);

router.delete(
  "/:id",
  protect,
  deleteColdStorage
);

module.exports = router;