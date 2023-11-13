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
    const pipeline = [
      {
        $match: {
          symbol: req.params.symbol,
        },
      },
      {
        $unwind: "$quotes",
      },
      {
        $group: {
          _id: {
            year: { $year: "$quotes.date" },
            month: { $month: "$quotes.date" },
            day: { $dayOfMonth: "$quotes.date" },
          },
          open: { $first: "$quotes.open" },
          close: { $last: "$quotes.close" },
          high: { $max: "$quotes.high" },
          low: { $min: "$quotes.low" },
          volume: { $sum: "$quotes.volume" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          open: 1,
          close: 1,
          high: 1,
          low: 1,
          volume: 1,
        },
      },
    ];

    const result = await StockPrices.aggregate(pipeline);
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
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
