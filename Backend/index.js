import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { runScript, getStocksInformation } from "./scraper/tadawul.js";
import StockFinancials from "./models/stockFinancials.js";
import StockInformation from "./models/stockInformation.js";
import yahooFinance from "yahoo-finance2";
import fs from "fs";
import StockPrices from "./models/stockPrices.js";
import axios from "axios";
import stockAPI from "./services/stocks.js";
import pytohnStockAPI from "./services-python/services-python.js";

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
app.use("/api", stockAPI);
app.use("/python-api", pytohnStockAPI);

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
  // saveStockCapital();
  // getSymbols();
  // saveStockPrices();
  // saveStockInformationData();
  runScript()
    .then(() => {
      console.log("Script completed successfully");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
