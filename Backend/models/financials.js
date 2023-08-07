import mongoose from "mongoose";

const stockFinancialsSchema = new mongoose.Schema({
  ticker: String,
  name: String,
  balanceSheet: [
    {
      year: String,
      current_assets: String,
      inventory: String,
      investments: String,
      fixed_assets: String,
      other_assets: String,
      total_assets: String,
      current_liabilities: String,
      non_current_liabilities: String,
      other_liabilities: String,
      shareholders_equity: String,
      total_liabilities_and_shareholder_equity: String,
      minority_interests: String,
      figures_in: String,
      currency_in: String,
      last_update_date: String,
    },
  ],
  incomeSheet: [
    {
      year: String,
      sales: String,
      sales_cost: String,
      total_income: String,
      total_revenues: String,
      admin_marketing_expenses: String,
      depreciation: String,
      other_expenses: String,
      total_expenses: String,
      net_income_before_zakat: String,
      zakat: String,
      net_income: String,
      figures_in: String,
      currency_in: String,
      last_update_date: String,
    },
  ],
  cashFlow: [
    {
      date: String,
      netIncome: String,
      depreciation: String,
      accountsReceivable: String,
      inventory: String,
      prepaidExpenses: String,
      accountsPayable: String,
      otherChangesInOperActivity: String,
      purchasesOfFixedAssets: String,
      otherChangesInInvestingAct: String,
      increaseInDebts: String,
      otherChangesInFinancingAct: String,
      cashAtBeginningOfPeriod: String,
      cashAtEndOfPeriod: String,
    },
  ],
  dividends: [
    {
      announced_date: String,
      eligibility_date: String,
      distribution_date: String,
      distribution_way: String,
      dividend_per_share: String,
    },
  ],
});

const StockFinancials = mongoose.model(
  "StockFinancials",
  stockFinancialsSchema
);

export default StockFinancials;
