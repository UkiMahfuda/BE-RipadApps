const { Firestore } = require("@google-cloud/firestore");

const firestore = new Firestore({
  projectId: "capstone-ripad",
  keyFilename: `${__dirname}/serviceAccountKey.json`,
});

const savePredictionToFirestore = async (imageUrl, predictionResult) => {
  const predictionData = {
    imageUrl,
    predictionResult,
    timestamp: new Date(),
  };

  const docRef = await firestore.collection("predictions").add(predictionData);
  return docRef.id;
};

module.exports = { savePredictionToFirestore, firestore };
