import express from "express";
import StockInformation from "../models/stockInformation.js";
import StockFinancials from "../models/stockFinancials.js";
import StockPrices from "../models/stockPrices.js";
import { getStocksInformation } from "../scraper/tadawul.js";

const router = express.Router();

router.get("/stock-inforamtion/:symbol", (req, res) => {
  const symbol = req.params.symbol;
  StockInformation.findOne({ symbol: symbol })
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

router.get("/stock-financials/:symbol", (req, res) => {
  const symbol = req.params.symbol;
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

router.get("/stock-price/:symbol", async (req, res) => {
  try {
    const result = await StockPrices.find({
      symbol: req.params.symbol,
    });
    res.json(result);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
});

router.get("/companies/:sectorName?", async (req, res) => {
  const sectorName = req.params.sectorName;
  try {
    const symbolsWithSectors = await getStocksInformation();

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
router.get("/companies", async (req, res) => {
  try {
    const stocksInformationData = await getStocksInformation();
    res.json(stocksInformationData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the symbols." });
  }
});

export default router;
