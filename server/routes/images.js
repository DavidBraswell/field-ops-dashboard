const express = require("express");
const router = express.Router();
const { getImages, getCategories, uploadImage, deleteImage } = require("../controllers/imageController");
const { protect } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.use(protect);

router.get("/categories", getCategories);
router.get("/", getImages);

router.post("/upload", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ message: err.message });
    }
    next();
  });
}, uploadImage);

router.delete("/:id", deleteImage);

module.exports = router;