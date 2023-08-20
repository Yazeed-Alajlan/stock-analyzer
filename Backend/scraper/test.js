import exp from "constants";
import fs from "fs";
console.log("--------------------------------------------------------------");
// Read the JSON file
const jsonData = fs.readFileSync("data.json", "utf8");
const data = JSON.parse(jsonData);

const balanceSheetIndex = data.findIndex((row) => row[0] === "Balance Sheet");
const incomeStatementIndex = data.findIndex(
  (row) => row[0] === "Statement of Income"
);
const cashFlowIndex = data.findIndex((row) => row[0] === "Cash Flow");
const endIndex = data.findIndex((row) => row[0] === "Trading Date");

// Extract the dividend data
const dividendData = data.slice(1, balanceSheetIndex);

// Extract the balance sheet data
const balanceSheetData = data.slice(balanceSheetIndex, incomeStatementIndex);

// Extract the income statement data
const incomeStatementData = data.slice(incomeStatementIndex, cashFlowIndex);

// Extract the cash flow data
const cashFlowData = data.slice(cashFlowIndex, endIndex);

export { balanceSheetData, incomeStatementData, cashFlowData, dividendData };
