const { uploadFileToStorage } = require("../services/storage");

const predictDisease = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: false, error: "No file uploaded" });
  }
  try {
    const imageUrl = await uploadFileToStorage(req.file);

    res.status(200).json({ status: true, message: "Upload successful", url: imageUrl });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = { predictDisease };
