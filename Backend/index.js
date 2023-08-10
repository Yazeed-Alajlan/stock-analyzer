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

mapDataToStockFinancials();

async function mapDataToStockFinancials() {
  let numberOfColumns = balanceSheetData[0].length;
  const balanceSheetColumnData = [];
  for (let columnIndex = 1; columnIndex < numberOfColumns; columnIndex++) {
    const column = balanceSheetData.map((row) => row[columnIndex]);
    balanceSheetColumnData.push(column);
  }

  let incomeStatementColumnData = [];
  numberOfColumns = incomeStatementData[0].length;
  for (let columnIndex = 1; columnIndex < numberOfColumns; columnIndex++) {
    const column = incomeStatementData.map((row) => row[columnIndex]);
    incomeStatementColumnData.push(column);
  }

  let cashFlowColumnData = [];
  numberOfColumns = cashFlowData[0].length;
  for (let columnIndex = 1; columnIndex < numberOfColumns; columnIndex++) {
    const column = cashFlowData.map((row) => row[columnIndex]);
    cashFlowColumnData.push(column);
  }

  for (let i = 0; i < numberOfColumns - 1; i++) {
    let balanceSheetColumn = balanceSheetColumnData[i];
    let incomeStatementColumn = incomeStatementColumnData[i];
    let cashFlowColumn = cashFlowColumnData[i];

    const stockData = {
      ticker: "data.ticker",
      name: "data.name",
      balanceSheet: [
        {
          year: balanceSheetColumn[0],
          current_assets: balanceSheetColumn[1],
          inventory: balanceSheetColumn[2],
          investments: balanceSheetColumn[3],
          fixed_assets: balanceSheetColumn[4],
          other_assets: balanceSheetColumn[5],
          total_assets: balanceSheetColumn[6],
          current_liabilities: balanceSheetColumn[7],
          non_current_liabilities: balanceSheetColumn[8],
          other_liabilities: balanceSheetColumn[9],
          shareholders_equity: balanceSheetColumn[10],
          total_liabilities_and_shareholder_equity: balanceSheetColumn[11],
          minority_interests: balanceSheetColumn[12],
          figures_in: balanceSheetColumn[13],
          currency_in: balanceSheetColumn[14],
          last_update_date: balanceSheetColumn[15],
        },
      ],
      balanceSheetQuarterly: [
        {
          year: balanceSheetColumn[16],
          current_assets: balanceSheetColumn[17],
          inventory: balanceSheetColumn[18],
          investments: balanceSheetColumn[19],
          fixed_assets: balanceSheetColumn[20],
          other_assets: balanceSheetColumn[21],
          total_assets: balanceSheetColumn[22],
          current_liabilities: balanceSheetColumn[23],
          non_current_liabilities: balanceSheetColumn[24],
          other_liabilities: balanceSheetColumn[25],
          shareholders_equity: balanceSheetColumn[26],
          total_liabilities_and_shareholder_equity: balanceSheetColumn[27],
          minority_interests: balanceSheetColumn[28],
          figures_in: balanceSheetColumn[29],
          currency_in: balanceSheetColumn[30],
          last_update_date: balanceSheetColumn[31],
        },
      ],
      incomeSheet: [
        {
          year: incomeStatementColumn[0],
          sales: incomeStatementColumn[1],
          sales_cost: incomeStatementColumn[2],
          total_income: incomeStatementColumn[3],
          other_revenues: incomeStatementColumn[4],
          total_revenues: incomeStatementColumn[5],
          admin_marketing_expenses: incomeStatementColumn[6],
          depreciation: incomeStatementColumn[7],
          other_expenses: incomeStatementColumn[8],
          total_expenses: incomeStatementColumn[9],
          net_income_before_zakat: incomeStatementColumn[10],
          zakat: incomeStatementColumn[11],
          net_income: incomeStatementColumn[12],
          balance_first_period: incomeStatementColumn[13],
          reserves: incomeStatementColumn[14],
          cash_dividends: incomeStatementColumn[15],
          other_distributions: incomeStatementColumn[16],
          balance_end_period: incomeStatementColumn[17],
          figures_in: incomeStatementColumn[18],
          currency_in: incomeStatementColumn[19],
          last_update_date: incomeStatementColumn[20],
        },
      ],
      incomeSheetQuarterly: [
        {
          year: incomeStatementColumn[21],
          sales: incomeStatementColumn[22],
          sales_cost: incomeStatementColumn[23],
          total_income: incomeStatementColumn[24],
          other_revenues: incomeStatementColumn[25],
          total_revenues: incomeStatementColumn[26],
          admin_marketing_expenses: incomeStatementColumn[27],
          depreciation: incomeStatementColumn[28],
          other_expenses: incomeStatementColumn[29],
          total_expenses: incomeStatementColumn[30],
          net_income_before_zakat: incomeStatementColumn[31],
          zakat: incomeStatementColumn[32],
          net_income: incomeStatementColumn[33],
          balance_first_period: incomeStatementColumn[34],
          reserves: incomeStatementColumn[35],
          cash_dividends: incomeStatementColumn[36],
          other_distributions: incomeStatementColumn[37],
          balance_end_period: incomeStatementColumn[38],
          figures_in: incomeStatementColumn[39],
          currency_in: incomeStatementColumn[40],
          last_update_date: incomeStatementColumn[41],
        },
      ],
      cashFlow: [
        {
          year: cashFlowColumn[0],
          net_income: cashFlowColumn[1],
          depreciation: cashFlowColumn[2],
          accounts_receivable: cashFlowColumn[3],
          inventory: cashFlowColumn[4],
          prepaid_expenses: cashFlowColumn[5],
          accounts_payable: cashFlowColumn[6],
          other_changes_operating_activity: cashFlowColumn[7],
          purchases_fixed_assets: cashFlowColumn[8],
          other_changes_investing_activity: cashFlowColumn[9],
          increase_in_debts: cashFlowColumn[10],
          other_changes_financing_activity: cashFlowColumn[11],
          cash_beginning_period: cashFlowColumn[12],
          cash_end_period: cashFlowColumn[13],
          figures_in: cashFlowColumn[14],
          currency_in: cashFlowColumn[15],
          last_update_date: cashFlowColumn[16],
        },
      ],
      cashFlowQuarterly: [
        {
          year: cashFlowColumn[17],
          net_income: cashFlowColumn[18],
          depreciation: cashFlowColumn[19],
          accounts_receivable: cashFlowColumn[20],
          inventory: cashFlowColumn[21],
          prepaid_expenses: cashFlowColumn[22],
          accounts_payable: cashFlowColumn[23],
          other_changes_operating_activity: cashFlowColumn[24],
          purchases_fixed_assets: cashFlowColumn[25],
          other_changes_investing_activity: cashFlowColumn[26],
          increase_in_debts: cashFlowColumn[27],
          other_changes_financing_activity: cashFlowColumn[28],
          cash_beginning_period: cashFlowColumn[29],
          cash_end_period: cashFlowColumn[30],
          figures_in: cashFlowColumn[31],
          currency_in: cashFlowColumn[32],
          last_update_date: cashFlowColumn[33],
        },
      ],
    };
    console.log(stockData.balanceSheet);
    console.log("--------------------------------------1");
    console.log(stockData.balanceSheetQuarterly);
    console.log("--------------------------------------2");

    console.log(stockData.incomeSheet);
    console.log("--------------------------------------3");

    console.log(stockData.incomeSheetQuarterly);
    console.log("--------------------------------------4");

    console.log(stockData.cashFlow);
    console.log("--------------------------------------5");
    console.log(stockData.cashFlowQuarterly);
    console.log("--------------------------------------6");

    try {
      const stock = await StockFinancials.findOne({
        name: stockData.name,
      }).exec();
      if (stock) {
        const existingYear = stock.balanceSheet.some(
          (balanceSheetData) =>
            balanceSheetData.year === stockData.balanceSheet[0].year
        );
        if (!existingYear) {
          stock.balanceSheet.push(stockData.balanceSheet[0]);
          stock.balanceSheetQuarterly.push(stockData.balanceSheetQuarterly[0]);
          stock.incomeSheet.push(stockData.incomeSheet[0]);
          stock.incomeSheetQuarterly.push(stockData.incomeSheetQuarterly[0]);
          stock.cashFlow.push(stockData.cashFlow[0]);
          stock.cashFlowQuarterly.push(stockData.cashFlowQuarterly[0]);
          await stock.save();
          console.log("New data added to the existing record");
        } else {
          console.log(
            "Data for year",
            stockData.balanceSheet[0].year,
            "already exists. Skipping."
          );
        }
      } else {
        const newData = new StockFinancials(stockData);
        await newData.save();
        console.log("First time");
      }
    } catch (error) {
      throw error;
    }
  }

  return true;
}

// const data = new StockFinancials({
//   ticker: "AAPL",
//   name: "Apple Inc.",
//   balanceSheet: [
//     {
//       year: "2022",
//       current_assets: "1,259,133",
//       inventory: "203,387",
//       investments: "129,788",
//       fixed_assets: "3,069,274",
//       other_assets: "-",
//       total_assets: "4,661,582",
//       current_liabilities: "795,023",
//       non_current_liabilities: "790,225",
//       other_liabilities: "-",
//       shareholders_equity: "2,922,847",
//       total_liabilities_and_shareholder_equity: "4,661,582",
//       minority_interests: "153,487",
//       figures_in: "Thousands",
//       currency_in: "SAR",
//       last_update_date: "2023-03-22",
//     },
//     {
//       year: "2023",
//       current_assets: "1,388,333",
//       inventory: "191,979",
//       investments: "195,995",
//       fixed_assets: "3,059,527",
//       other_assets: "-",
//       total_assets: "4,835,834",
//       current_liabilities: "849,821",
//       non_current_liabilities: "734,955",
//       other_liabilities: "-",
//       shareholders_equity: "3,089,454",
//       total_liabilities_and_shareholder_equity: "4,835,834",
//       minority_interests: "161,604",
//       figures_in: "Thousands",
//       currency_in: "SAR",
//       last_update_date: "2023-05-14",
//     },
//   ],
//   dividends: [
//     {
//       announced_date: "2022-12-22",
//       eligibility_date: "2023-05-07",
//       distribution_date: "2023-05-17",
//       distribution_way: "Account Transfer",
//       dividend_per_share: "3",
//     },
//   ],
// });
