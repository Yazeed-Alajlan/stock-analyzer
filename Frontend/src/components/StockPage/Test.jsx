import React, { useState } from "react";

function Test() {
  const [data, setData] = useState({ inputFeature: 0 });
  const [prediction, setPrediction] = useState(null);

  const handlePredict = () => {
    // Make a POST request to the Node.js backend
    fetch("http://localhost:5000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    })
      .then((response) => response.json())
      .then((data) => setPrediction(data.prediction))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <input
        type="number"
        value={data.inputFeature}
        onChange={(e) => setData({ inputFeature: e.target.value })}
      />
      <button onClick={handlePredict}>Predict</button>
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
  );
}

export default Test;
