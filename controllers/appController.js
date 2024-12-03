const { uploadFileToStorage } = require("../services/storage");
const { predictDiseaseFromModel } = require("../services/prediction");
const { savePredictionToFirestore } = require("../services/firestore");
const { firestore } = require("../services/firestore");

const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.uid; // UID dari middleware Firebase
    const historyCollection = firestore.collection("predictions");
    const snapshot = await historyCollection.where("userId", "==", userId).orderBy("timestamp", "desc").get();

    const history = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ status: true, history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error.message });
  }
};

const getAllUserHistory = async (req, res) => {
  try {
    const historyCollection = firestore.collection("predictions");
    const snapshot = await historyCollection.orderBy("timestamp", "desc").get();

    const history = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ status: true, history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error.message });
  }
};

const predictDisease = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: false, error: "No file uploaded" });
  }

  try {
    // 1. Kirim gambar langsung ke API model untuk prediksi
    const predictionResult = await predictDiseaseFromModel(req.file);

    // 2. Setelah prediksi, unggah gambar ke Google Cloud Storage
    const imageUrl = await uploadFileToStorage(req.file);

    // 3. Simpan data prediksi dan URL gambar ke Firestore
    // const userId = req.user.uid; // Pastikan middleware autentikasi mengisi `req.user`
    const docId = await savePredictionToFirestore(imageUrl, predictionResult);

    // 4. Kirim respons ke pengguna
    res.status(200).json({
      status: true,
      message: "Prediction successful",
      predictionId: docId,
      imageUrl,
      predictionResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: error.message });
  }
};

const deletePrediction = async (req, res) => {
  const { predictionId } = req.params;

  try {
    const docRef = firestore.collection("predictions").doc(predictionId);
    await docRef.delete();

    res.status(200).json({
      status: true,
      message: `Deleted History Success`,
    });
  } catch (error) {
    console.error("Error delete prediction:", error);
    res.status(500).json({
      status: false,
      error: "Fail to delete prediction",
    });
  }
};

module.exports = { predictDisease, getUserHistory, getAllUserHistory, deletePrediction };
