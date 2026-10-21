const MarketPrice = require("../models/MarketPrice");

const getMarketPrices = async (req, res) => {
  try {
    const prices = await MarketPrice.find()
      .sort({ date: -1 });

    res.status(200).json({
      count: prices.length,
      prices,
    });
  } catch (error) {
    console.error(
      "Get Market Prices Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while fetching market prices",
    });
  }
};

const addMarketPrice = async (req, res) => {
  try {
    const {
      cropName,
      market,
      location,
      price,
      unit,
    } = req.body;

    if (
      !cropName ||
      !market ||
      !location ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required details",
      });
    }

    const marketPrice =
      await MarketPrice.create({
        cropName,
        market,
        location,
        price,
        unit,
      });

    res.status(201).json({
      message: "Market price added successfully",
      marketPrice,
    });
  } catch (error) {
    console.error(
      "Add Market Price Error:",
      error.message
    );

    res.status(500).json({
      message: "Server error while adding market price",
    });
  }
};

module.exports = {
  getMarketPrices,
  addMarketPrice,
};