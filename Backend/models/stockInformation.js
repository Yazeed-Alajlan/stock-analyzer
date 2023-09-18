import mongoose from "mongoose";

const stockInformationSchema = new mongoose.Schema({
  symbol: String,
  sectorNameEn: String,
  tradingNameEn: String,
  sectorNameAr: String,
  tradingNameAr: String,
  companyNameEN: String,
  companyNameAR: String,
  market_type: String,
  summary: [
    {
      trade_date: Date,
      open: String,
      close: String,
      high: String,
      low: String,
      previous_close: String,
      change_value: String,
      change_ratio: String,
      trade_count: String,
      trade_value: String,
      trade_volume: String,
      fifty_two_week_high: String,
      fifty_two_week_low: String,
      previous_close_7_days_back: String,
      previous_close_30_days_back: String,
      previous_close_365_days_back: String,
      return_value_last_week: String,
      return_value_last_month: String,
      return_value_last_year: String,
      return_last_week: String,
      return_last_month: String,
      return_last_year: String,
      daily_price_to_earnings: String,
      daily_price_to_book_value: String,
      daily_market_capitalization: String,
      basic_earnings_per_share_ttm: String,
      book_value_per_share_ttm: String,
    },
  ],
});

const StockInformation = mongoose.model(
  "StockInformation",
  stockInformationSchema
);

export default StockInformation;
