const express = require("express");
const multer = require("multer");
const router = express.Router();
const { predictDisease } = require("../controllers/appController");

const upload = multer();

router.post("/predict", upload.single("image"), predictDisease);

module.exports = router;
