import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { runScript } from "./scraper/tadawul.js";
import StockFinancials from "./models/financials.js";

const app = express();
const port = 5001;
app.use(cors());
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/stockDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

app.post("/api/register", async (req, res) => {
  console.log("hissdasd");
  await runScript();
});

app.get("/", (req, res) => {
  console.log("hi");
  // const symbol = req.params.symbol;
  const symbol = 4321;
  StockFinancials.findOne({ symbol: symbol })
    .then((stock) => {
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      console.log(stock);
      res.json(stock);
    })
    .catch((error) => {
      console.error("Error retrieving stock:", error);
      res.status(500).json({ error: "Internal server error" });
    });

  // // Fetch or generate the data you want to send
  // const data = { message: "Hello from the server!adsdassasdasad" };

  // // Send the data as a JSON response
  // res.json(data);
});
app.listen(port, () => {
  console.log(`Server is listening at https://localhost:${port}`);
});

const connectDB = async () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/stockDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB:", error);
    });
};
