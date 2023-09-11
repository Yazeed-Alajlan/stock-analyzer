import mongoose from "mongoose";

const stockFinancialsSchema = new mongoose.Schema({
  symbol: String,
  companyNameEN: String,
  companyNameAR: String,
  market_type: String,
  tradingNameEn: String,
  tradingNameAr: String,
  balanceSheet: [],
  balanceSheetQuarterly: [],
  incomeSheet: [],
  incomeSheetQuarterly: [],
  cashFlow: [],
  cashFlowQuarterly: [],
  dividends: [
    {
      announced_date: String,
      eligibility_date: String,
      distribution_date: String,
      distribution_way: String,
      dividend_per_share: String,
    },
  ],
  foreignOwnership: [
    {
      date: String,
      percentage: String,
    },
  ],
});

const StockFinancials = mongoose.model(
  "StockFinancials",
  stockFinancialsSchema
);

export default StockFinancials;
