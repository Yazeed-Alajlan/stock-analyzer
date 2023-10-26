import axios from "axios";
import React, { useState, useEffect } from "react";

function Test() {
  const [data, setData] = useState({ inputFeature: 0 });
  const [prediction, setPrediction] = useState("");

  const handlePredict = () => {
    // Make a POST request to the Node.js backend
    fetch("http://localhost:5000/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data.inputFeature }), // Send the inputFeature value
    })
      .then((response) => response.json())
      .then((data) => setPrediction(data.prediction))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:5000/api/predict";
        const response = await axios.get(url);
        console.log("fetch data");
        setPrediction(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <input
        type="number"
        value={data.inputFeature}
        onChange={(e) => setData({ inputFeature: e.target.value })}
      />
      <button onClick={handlePredict}>Predict</button>
      {prediction && <p>Prediction: {prediction}</p>}
      <div>adssad</div>
    </div>
  );
}

export default Test;
