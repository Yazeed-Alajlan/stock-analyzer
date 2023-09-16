import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { runScript, getSymbols } from "./scraper/tadawul.js";
import StockFinancials from "./models/stockFinancials.js";
import StockInformation from "./models/stockInformation.js";
import yahooFinance from "yahoo-finance2";
import fs from "fs";

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
  saveStockInformationData();
  // runScript()
  //   .then(() => {
  //     console.log("Script completed successfully");
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });
});

app.get("/stock", (req, res) => {
  const symbol = req.query.symbol;
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

// Define a route to fetch stock price data
app.get("/api/stock-price/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol + ".SR";

    // Fetch stock data using yahoo-finance2
    const queryOptions = { period1: "2021-05-08" /* ... */ };
    const result = await yahooFinance._chart(symbol, queryOptions);
    console.log(result);
    if (!result) {
      throw new Error("Invalid stock symbol or no data available.");
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Unable to fetch stock data" });
  }
});

const saveStockInformationData = async () => {
  const jsonData = fs.readFileSync("stockData.json", "utf8");
  const data = JSON.parse(jsonData);
  for (const company of data.items) {
    console.log(company.symbol_code);
    if (company.symbol_code == "2083") {
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
            return_last_month:
              company.today_points.return_last_month.toString(),
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
  }
};
