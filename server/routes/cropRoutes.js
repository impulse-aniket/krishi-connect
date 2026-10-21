const express = require("express");

const {
  addCrop,
  getMyCrops,
  getCropById,
  getAvailableCrops,
  getCropForBuyer,
  updateCrop,
  deleteCrop,
} = require("../controllers/cropController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL AVAILABLE CROPS
router.get(
  "/",
  protect,
  getAvailableCrops
);

// GET SINGLE AVAILABLE CROP FOR BUYER
router.get(
  "/buyer/:id",
  protect,
  getCropForBuyer
);

// ADD CROP
router.post(
  "/",
  protect,
  addCrop
);

// GET MY CROPS
router.get(
  "/my-crops",
  protect,
  getMyCrops
);

// GET SINGLE CROP FOR FARMER
router.get(
  "/:id",
  protect,
  getCropById
);

// UPDATE CROP
router.put(
  "/:id",
  protect,
  updateCrop
);

// DELETE CROP
router.delete(
  "/:id",
  protect,
  deleteCrop
);

module.exports = router;