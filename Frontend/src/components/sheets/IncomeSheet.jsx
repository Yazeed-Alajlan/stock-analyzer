import { useState } from "react";
import { isEqual } from "lodash";
import CustomButton from "../utils/CustomButton";
import { Table } from "react-bootstrap";
const IncomeSheet = ({ quarterlyData, annualData }) => {
  const [data, setData] = useState(quarterlyData);
  const [title, setTitle] = useState("Show Annual Data");

  const years = data.map((item) => item.year);
  const sales = data.map((item) => item.sales);
  const salesCost = data.map((item) => item.sales_cost);
  const totalIncome = data.map((item) => item.total_income);
  const otherRevenues = data.map((item) => item.other_revenues);
  const totalRevenues = data.map((item) => item.total_revenues);
  const adminMarketingExpenses = data.map(
    (item) => item.admin_marketing_expenses
  );
  const depreciation = data.map((item) => item.depreciation);
  const otherExpenses = data.map((item) => item.other_expenses);
  const totalExpenses = data.map((item) => item.total_expenses);
  const netIncomeBeforeZakat = data.map((item) => item.net_income_before_zakat);
  const zakat = data.map((item) => item.zakat);
  const netIncome = data.map((item) => item.net_income);
  const balanceFirstPeriod = data.map((item) => item.balance_first_period);
  const reserves = data.map((item) => item.reserves);
  const cashDividends = data.map((item) => item.cash_dividends);
  const otherDistributions = data.map((item) => item.other_distributions);
  const balanceEndPeriod = data.map((item) => item.balance_end_period);
  const figuresIn = data.map((item) => item.figures_in);
  const currencyIn = data.map((item) => item.currency_in);
  const lastUpdateDate = data.map((item) => item.last_update_date);

  const toggleData = () => {
    if (isEqual(data, quarterlyData)) {
      setData(annualData);
      setTitle("Show Quarterly Data");
    } else {
      setData(quarterlyData);
      setTitle("Show Annual Datsa");
    }
  };
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Income Sheet</th>
            {years.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sales</td>
            {sales.map((sale, index) => (
              <td key={index}>{sale}</td>
            ))}
          </tr>
          <tr>
            <td>Sales Cost</td>
            {salesCost.map((cost, index) => (
              <td key={index}>{cost}</td>
            ))}
          </tr>
          <tr>
            <td>Total Income</td>
            {totalIncome.map((income, index) => (
              <td key={index}>{income}</td>
            ))}
          </tr>
          <tr>
            <td>Other Revenues</td>
            {otherRevenues.map((revenue, index) => (
              <td key={index}>{revenue}</td>
            ))}
          </tr>
          <tr>
            <td>Total Revenues</td>
            {totalRevenues.map((revenue, index) => (
              <td key={index}>{revenue}</td>
            ))}
          </tr>
          <tr>
            <td>Admin & Marketing Expenses</td>
            {adminMarketingExpenses.map((expense, index) => (
              <td key={index}>{expense}</td>
            ))}
          </tr>
          <tr>
            <td>Depreciation</td>
            {depreciation.map((deprec, index) => (
              <td key={index}>{deprec}</td>
            ))}
          </tr>
          <tr>
            <td>Other Expenses</td>
            {otherExpenses.map((expense, index) => (
              <td key={index}>{expense}</td>
            ))}
          </tr>
          <tr>
            <td>Total Expenses</td>
            {totalExpenses.map((expense, index) => (
              <td key={index}>{expense}</td>
            ))}
          </tr>
          <tr>
            <td>Net Income Before Zakat</td>
            {netIncomeBeforeZakat.map((income, index) => (
              <td key={index}>{income}</td>
            ))}
          </tr>
          <tr>
            <td>Zakat</td>
            {zakat.map((amount, index) => (
              <td key={index}>{amount}</td>
            ))}
          </tr>
          <tr>
            <td>Net Income</td>
            {netIncome.map((income, index) => (
              <td key={index}>{income}</td>
            ))}
          </tr>
          <tr>
            <td>Balance First Period</td>
            {balanceFirstPeriod.map((balance, index) => (
              <td key={index}>{balance}</td>
            ))}
          </tr>
          <tr>
            <td>Reserves</td>

            {reserves.map((reserve, index) => (
              <td key={index}>{reserve}</td>
            ))}
          </tr>
          <tr>
            <td>Cash Dividends</td>
            {cashDividends.map((dividend, index) => (
              <td key={index}>{dividend}</td>
            ))}
          </tr>
          <tr>
            <td>Other Distributions</td>
            {otherDistributions.map((distribution, index) => (
              <td key={index}>{distribution}</td>
            ))}
          </tr>
          <tr>
            <td>Balance End Period</td>
            {balanceEndPeriod.map((balance, index) => (
              <td key={index}>{balance}</td>
            ))}
          </tr>
          <tr>
            <td> Figures</td>
            {figuresIn.map((interest, index) => (
              <td key={index}>{interest}</td>
            ))}
          </tr>
          <tr>
            <td> Currency</td>
            {currencyIn.map((interest, index) => (
              <td key={index}>{interest}</td>
            ))}
          </tr>
          <tr>
            <td> Last Updated</td>
            {lastUpdateDate.map((interest, index) => (
              <td key={index}>{interest}</td>
            ))}
          </tr>
        </tbody>
      </Table>{" "}
      <CustomButton onClick={toggleData} title={title} />
    </div>
  );
};

export default IncomeSheet;
