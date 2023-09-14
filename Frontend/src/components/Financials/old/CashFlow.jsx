import { useState } from "react";
import { isEqual } from "lodash";
import CustomButton from "../utils/CustomButton";
import { Table } from "react-bootstrap";
const CashFlow = ({ quarterlyData, annualData }) => {
  const [data, setData] = useState(quarterlyData);
  const [title, setTitle] = useState("Show Annual Data");

  const years = data.map((item) => item.year);
  const netIncome = data.map((item) => item.net_income);
  const depreciation = data.map((item) => item.depreciation);
  const accountsReceivable = data.map((item) => item.accounts_receivable);
  const inventory = data.map((item) => item.inventory);
  const prepaidExpenses = data.map((item) => item.prepaid_expenses);
  const accountsPayable = data.map((item) => item.accounts_payable);
  const otherChangesOperatingActivity = data.map(
    (item) => item.other_changes_operating_activity
  );
  const purchasesFixedAssets = data.map((item) => item.purchases_fixed_assets);
  const otherChangesInvestingActivity = data.map(
    (item) => item.other_changes_investing_activity
  );
  const increaseInDebts = data.map((item) => item.increase_in_debts);
  const otherChangesFinancingActivity = data.map(
    (item) => item.other_changes_financing_activity
  );
  const cashBeginningPeriod = data.map((item) => item.cash_beginning_period);
  const cashEndPeriod = data.map((item) => item.cash_end_period);
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
            <th>Cash Flow</th>
            {years.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Net Income</td>
            {netIncome.map((income, index) => (
              <td key={index}>{income}</td>
            ))}
          </tr>
          <tr>
            <td>Depreciation</td>
            {depreciation.map((dep, index) => (
              <td key={index}>{dep}</td>
            ))}
          </tr>
          <tr>
            <td>Accounts Receivable</td>
            {accountsReceivable.map((ar, index) => (
              <td key={index}>{ar}</td>
            ))}
          </tr>
          <tr>
            <td>Inventory</td>
            {inventory.map((inv, index) => (
              <td key={index}>{inv}</td>
            ))}
          </tr>
          <tr>
            <td>Prepaid Expenses</td>
            {prepaidExpenses.map((expense, index) => (
              <td key={index}>{expense}</td>
            ))}
          </tr>
          <tr>
            <td>Accounts Payable</td>
            {accountsPayable.map((payable, index) => (
              <td key={index}>{payable}</td>
            ))}
          </tr>
          <tr>
            <td>Other Changes in Operating Activity</td>
            {otherChangesOperatingActivity.map((change, index) => (
              <td key={index}>{change}</td>
            ))}
          </tr>
          <tr>
            <td>Purchases of Fixed Assets</td>
            {purchasesFixedAssets.map((purchase, index) => (
              <td key={index}>{purchase}</td>
            ))}
          </tr>
          <tr>
            <td>Other Changes in Investing Activity</td>
            {otherChangesInvestingActivity.map((change, index) => (
              <td key={index}>{change}</td>
            ))}
          </tr>
          <tr>
            <td>Increase in Debts</td>
            {increaseInDebts.map((increase, index) => (
              <td key={index}>{increase}</td>
            ))}
          </tr>
          <tr>
            <td>Other Changes in Financing Activity</td>
            {otherChangesFinancingActivity.map((change, index) => (
              <td key={index}>{change}</td>
            ))}
          </tr>
          <tr>
            <td>Cash Beginning Period</td>
            {cashBeginningPeriod.map((cash, index) => (
              <td key={index}>{cash}</td>
            ))}
          </tr>
          <tr>
            <td>Cash End Period</td>
            {cashEndPeriod.map((cash, index) => (
              <td key={index}>{cash}</td>
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

export default CashFlow;
