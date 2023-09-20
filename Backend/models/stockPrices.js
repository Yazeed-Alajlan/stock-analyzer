import mongoose from "mongoose";

const stockPricesSchema = new mongoose.Schema({
  symbol: String,
  quotes: [
    {
      date: Date,
      open: Number,
      close: Number,
      high: Number,
      low: Number,
      volume: Number,
      adjclose: Number,
    },
  ],
});

const StockPrices = mongoose.model("StockPrices", stockPricesSchema);

export default StockPrices;
