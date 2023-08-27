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
});

const StockInformation = mongoose.model(
  "StockInformation",
  stockInformationSchema
);

export default StockInformation;

//  sectorName: item.sectorName,
//       companyRef: item.companyRef,
//       acrynomName: item.acrynomName,
//       netChange: item.netChangeModified,
//       highPrice: item.highPriceModified,
//       lowPrice: item.lowPriceModified,
//       precentChange: item.precentChangeModified,
//       previousClosePrice: item.previousClosePrice,
//       todayClosePrice: item.todayClosePrice,
//       todayOpen: item.todayOpenModified,
//       previousClosePrice: item.previousClosePrice,
