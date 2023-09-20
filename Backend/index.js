import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { runScript, getSymbols } from "./scraper/tadawul.js";
import StockFinancials from "./models/stockFinancials.js";
import StockInformation from "./models/stockInformation.js";
import yahooFinance from "yahoo-finance2";
import fs from "fs";
import StockPrices from "./models/stockPrices.js";

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
  // saveStockPrices();
  // saveStockInformationData();
  // runScript()
  //   .then(() => {
  //     console.log("Script completed successfully");
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });
});

app.get("/api/StockFinancialData/:symbol", (req, res) => {
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

app.get("/api/StockInformation/:symbol", (req, res) => {
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

app.get("/api/StockPrice/:symbol", (req, res) => {
  // const symbol = req.params.symbol;
  // Define your date range
  const symbol = "2222";
  const startDate = new Date("2023-01-01T00:00:00.000Z");
  const endDate = new Date("2023-01-04T23:59:59.999Z");

  StockPrices.find({
    symbol: symbolToFind,
    "price.date": {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .then((result) => {
      // Do something with the query result
      console.log(result);
    })
    .catch((error) => {
      console.error("Error querying data:", error);
    });
});

app.get("/companies/:sectorName?", async (req, res) => {
  const sectorName = req.params.sectorName;
  try {
    const symbolsWithSectors = await getSymbols();

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
app.get("/api/stock-price/:symbol", async (req, res) => {
  try {
    const result = await StockPrices.find({
      symbol: req.params.symbol,
    });
    res.json(result);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
});

const saveStockInformationData = async () => {
  const jsonData = fs.readFileSync("stockData.json", "utf8");
  const data = JSON.parse(jsonData);
  for (const company of data.items) {
    console.log(company.symbol_code);
    try {
      const stock = await StockInformation.findOne({
        symbol: company.symbol_code,
      }).exec();
      if (stock) {
        // Create an object with all the fields
        const newSummaryData = {
          trade_date: new Date(company.today_points.trade_date),
          open: company.today_points.open.toString(),
          close: company.today_points.close.toString(),
          high: company.today_points.high.toString(),
          low: company.today_points.low.toString(),
          previous_close: company.today_points.previous_close.toString(),
          change_value: company.today_points.change_value.toString(),
          change_ratio: company.today_points.change_ratio.toString(),
          trade_count: company.today_points.trade_count.toString(),
          trade_value: company.today_points.trade_value.toString(),
          trade_volume: company.today_points.trade_volume.toString(),
          fifty_two_week_high:
            company.today_points.fifty_two_week_high.toString(),
          fifty_two_week_low:
            company.today_points.fifty_two_week_low.toString(),
          previous_close_7_days_back:
            company.today_points.previous_close_7_days_back.toString(),
          previous_close_30_days_back:
            company.today_points.previous_close_30_days_back.toString(),
          previous_close_365_days_back:
            company.today_points.previous_close_365_days_back.toString(),
          return_value_last_week:
            company.today_points.return_value_last_week.toString(),
          return_value_last_month:
            company.today_points.return_value_last_month.toString(),
          return_value_last_year:
            company.today_points.return_value_last_year.toString(),
          return_last_week: company.today_points.return_last_week.toString(),
          return_last_month: company.today_points.return_last_month.toString(),
          return_last_year: company.today_points.return_last_year.toString(),
          daily_price_to_earnings:
            company.today_points.daily_price_to_earnings.toString(),
          daily_price_to_book_value:
            company.today_points.daily_price_to_book_value.toString(),
          daily_market_capitalization:
            company.today_points.daily_market_capitalization.toString(),
          basic_earnings_per_share_ttm:
            company.today_points.basic_earnings_per_share_ttm.toString(),
          book_value_per_share_ttm:
            company.today_points.book_value_per_share_ttm.toString(),
        };

        // Push the new data to the "summary" array
        stock.summary.push(newSummaryData);

        // Save the updated document back to the database
        await stock.save();
      }
    } catch (error) {
      console.error("Error retrieving stock:", error);
    }
  }
};

async function saveStockPrices() {
  try {
    const symbols = await getSymbols();
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
