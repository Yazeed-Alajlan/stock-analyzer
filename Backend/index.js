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

async function saveStockPrices() {
  try {
    const symbols = await getStocksInformation();
    for (const stock of symbols) {
      console.log(stock.symbol);
      const symbol = stock.symbol;
      const period1 = "2022-01-01";
      const period2 = new Date().toISOString().split("T")[0];
      const queryOptions = { period1, period2 };
      const result = await yahooFinance._chart(
        stock.symbol + ".SR",
        queryOptions
      );
      if (!result || !result.quotes || result.quotes.length === 0) {
        throw new Error("Invalid stock symbol or no data available.");
      }
      // Check if a document with the same symbol already exists in the database
      const existingDocument = await StockPrices.findOne({ symbol });
      console.log(result.quotes);
      if (existingDocument) {
        // If the document exists, update it with the new data
        for (const quote of result.quotes) {
          const existingDataPoint = existingDocument.quotes.find(
            (dataPoint) =>
              dataPoint.date.toLocaleDateString("en-GB") ===
              new Date(quote.date).toLocaleDateString("en-GB")
          );
          if (!existingDataPoint) {
            existingDocument.quotes.push({
              date: new Date(quote.date), // Convert the date string to a Date object
              open: quote.open,
              close: quote.close,
              high: quote.high,
              low: quote.low,
              volume: quote.volume,
              adjclose: quote.adjclose,
            });
          }
        }
        await existingDocument.save();
      } else {
        // If the document does not exist, create a new one with the new data
        const stockPriceData = {
          symbol: symbol,
          quotes: result.quotes.map((quote) => ({
            date: new Date(quote.date), // Convert the date string to a Date object
            open: quote.open,
            close: quote.close,
            high: quote.high,
            low: quote.low,
            volume: quote.volume,
            adjclose: quote.adjclose,
          })),
        };
        const stockPrice = new StockPrices(stockPriceData);
        await stockPrice.save();
      }
    }
  } catch (error) {
    console.error("Error fetching and saving stock data:", error);
    res.status(500).json({ error: "Unable to fetch and save stock data" });
  }
}
