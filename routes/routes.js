const express = require("express");
const multer = require("multer");
const { verifyToken } = require("../middleware/appMiddleware");
const { predictDisease, getUserHistory, getAllUserHistory, deletePrediction } = require("../controllers/appController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});
multer();

router.post("/predict", upload.single("image"), predictDisease);
router.get("/history", getUserHistory);
router.get("/allHistory", getAllUserHistory);
router.delete("/history/:predictionId", deletePrediction);

module.exports = router;
