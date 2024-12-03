const express = require("express");
const multer = require("multer");
const { verifyToken } = require("../middleware/appMiddleware");
const { predictDisease, getUserHistory, getAllUserHistory, deletePrediction } = require("../controllers/appController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(), // Simpan file dalam memori untuk akses buffer
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran file, misalnya 5MB
});
multer(); // Middleware untuk mengunggah file

router.post("/predict", upload.single("image"), predictDisease);
router.get("/history", getAllUserHistory);
router.delete("/history/:predictionId", deletePrediction);

module.exports = router;
