const express = require("express");
const router = express.Router();
const { getAllSites, createSite, updateSite, deleteSite } = require("../controllers/sitesController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getAllSites);
router.post("/", createSite);
router.patch("/:id", updateSite);
router.delete("/:id", deleteSite);

module.exports = router;
