import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import StockFinancials from "./models/financials.js";
import {
  balanceSheetData,
  incomeStatementData,
  cashFlowData,
  dividendData,
} from "./scraper/test.js";

const app = express();
const port = 5000;

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
app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
  console.log("heeeeeeeeeeeeeeelo");
  await connectDB();
  await addData();
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost/stockDB", {
      useNewUrlParser: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const addData = async (data) => {
  try {
    await data.save();
    console.log("Data added successfully:");
  } catch (err) {
    console.error(err.message);
  } finally {
    // mongoose.disconnect();
  }
};

// console.log(balanceSheetData);
mapDataToStockFinancials(balanceSheetData);
// await addData(data);

function mapDataToStockFinancials(data) {
  const numberOfColumns = data[0].length;
  const columnData = [];

  for (let columnIndex = 0; columnIndex < numberOfColumns; columnIndex++) {
    const column = data.map((row) => row[columnIndex]);
    columnData.push(column);
  }

  // console.log(columnData);
  columnData.forEach(async (col) => {
    const data = new StockFinancials({
      ticker: "test",
      name: "test",
      balanceSheet: [
        {
          year: col[0],
          current_assets: col[1],
          inventory: col[2],
          investments: col[3],
          fixed_assets: col[4],
          other_assets: col[5],
          total_assets: col[6],
          current_liabilities: col[7],
          non_current_liabilities: col[8],
          other_liabilities: col[9],
          shareholders_equity: col[10],
          total_liabilities_and_shareholder_equity: col[11],
          minority_interests: col[12],
          figures_in: col[13],
          currency_in: col[14],
          last_update_date: col[15],
        },
      ],
    });

    try {
      const stock = await StockFinancials.findOne({ name: "test" }).exec();
      // console.log(stock.balanceSheet[0].year);
      // console.log(data.balanceSheet[0].year);

      if (stock && stock.balanceSheet[0].year != data.balanceSheet[0].year) {
        stock.balanceSheet.push(data.balanceSheet);
        await stock.save();
        console.log("New data added to the existing record");
      } else if (!stock) {
        await data.save();
        console.log("First time");
      }
    } catch (error) {
      throw error;
    }
  });
  return "stockFinancials";
}

const data = new StockFinancials({
  ticker: "AAPL",
  name: "Apple Inc.",
  balanceSheet: [
    {
      year: "2022",
      current_assets: "1,259,133",
      inventory: "203,387",
      investments: "129,788",
      fixed_assets: "3,069,274",
      other_assets: "-",
      total_assets: "4,661,582",
      current_liabilities: "795,023",
      non_current_liabilities: "790,225",
      other_liabilities: "-",
      shareholders_equity: "2,922,847",
      total_liabilities_and_shareholder_equity: "4,661,582",
      minority_interests: "153,487",
      figures_in: "Thousands",
      currency_in: "SAR",
      last_update_date: "2023-03-22",
    },
    {
      year: "2023",
      current_assets: "1,388,333",
      inventory: "191,979",
      investments: "195,995",
      fixed_assets: "3,059,527",
      other_assets: "-",
      total_assets: "4,835,834",
      current_liabilities: "849,821",
      non_current_liabilities: "734,955",
      other_liabilities: "-",
      shareholders_equity: "3,089,454",
      total_liabilities_and_shareholder_equity: "4,835,834",
      minority_interests: "161,604",
      figures_in: "Thousands",
      currency_in: "SAR",
      last_update_date: "2023-05-14",
    },
  ],
  dividends: [
    {
      announced_date: "2022-12-22",
      eligibility_date: "2023-05-07",
      distribution_date: "2023-05-17",
      distribution_way: "Account Transfer",
      dividend_per_share: "3",
    },
  ],
});
