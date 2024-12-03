const { Firestore } = require("@google-cloud/firestore");

// Inisialisasi Firestore dengan menggunakan kredensial JSON
const firestore = new Firestore({
  projectId: "capstone-ripad", // Ganti dengan ID proyek Anda
  keyFilename: `${__dirname}/serviceAccountKey.json`, // Path ke file kredensial
});

// Fungsi untuk menyimpan prediksi ke Firestore
const savePredictionToFirestore = async (imageUrl, predictionResult) => {
  const predictionData = {
    imageUrl,
    predictionResult,
    timestamp: new Date(), // Atur timestamp sesuai dengan waktu saat prediksi disimpan
  };

  const docRef = await firestore.collection("predictions").add(predictionData);
  return docRef.id; // Mengembalikan ID dokumen yang disimpan
};

// Mengekspor fungsi dan objek firestore untuk digunakan di file lain
module.exports = { savePredictionToFirestore, firestore };
