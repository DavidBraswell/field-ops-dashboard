const express = require("express");
const router = express.Router();
const {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  assignEquipment,
  deleteEquipment,
  getJobSites,
} = require("../controllers/equipmentController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/sites", getJobSites);
router.get("/", getAllEquipment);
router.get("/:id", getEquipmentById);
router.post("/", createEquipment);
router.patch("/:id", updateEquipment);
router.patch("/:id/assign", assignEquipment);
router.delete("/:id", deleteEquipment);

module.exports = router;
