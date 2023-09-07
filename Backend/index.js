import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
  runScript,
  getSymbols,
  getSymbolsWithSectors,
} from "./scraper/tadawul.js";
import StockFinancials from "./models/stockFinancials.js";
import StockInformation from "./models/stockInformation.js";

const app = express();
const port = 5000;
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
  // getSymbols();
  runScript()
    .then(() => {
      console.log("Script completed successfully");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

app.get("/stock", (req, res) => {
  const symbol = req.query.symbol;
  console.log(symbol);
  // const symbol = 4321;
  StockFinancials.findOne({ symbol: symbol })
    .then((stock) => {
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      res.json(stock);
    })
    .catch((error) => {
      console.error("Error retrieving stock:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});
app.get("/companies/:sectorName?", async (req, res) => {
  const sectorName = req.params.sectorName;
  console.log(sectorName);
  try {
    const symbolsWithSectors = await getSymbols();
    console.log(symbolsWithSectors);

    if (sectorName) {
      const filteredSymbols = symbolsWithSectors.filter(
        (symbol) =>
          symbol.sectorNameAr.toLowerCase() === sectorName.toLowerCase()
      );
      res.json(filteredSymbols);
    } else {
      res.json(symbolsWithSectors);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the symbols." });
  }
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
