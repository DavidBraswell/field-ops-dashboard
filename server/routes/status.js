const express = require("express");
const router = express.Router();
const { getStatusLogs, createStatusLog, updateStatusLog, deleteStatusLog } = require("../controllers/statusController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getStatusLogs);
router.post("/", createStatusLog);
router.patch("/:id", updateStatusLog);
router.delete("/:id", deleteStatusLog);

module.exports = router;
