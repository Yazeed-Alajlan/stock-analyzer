import axios from "axios";
import React, { useState, useEffect } from "react";

function Test() {
  const [data, setData] = useState({ inputFeature: 0 });
  const [prediction, setPrediction] = useState("");

  const handlePredict = () => {
    console.log(prediction);
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
      {prediction && <p>Prediction: </p>}
      <div>adssad</div>
    </div>
  );
}

export default Test;
