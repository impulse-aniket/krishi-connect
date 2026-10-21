const express = require("express");

const {
  getMarketPrices,
  addMarketPrice,
} = require("../controllers/marketPriceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMarketPrices);

router.post("/", protect, addMarketPrice);

module.exports = router;