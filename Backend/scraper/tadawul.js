import puppeteer from "puppeteer";
import mongoose from "mongoose";
import fs from "fs";
import StockFinancials from "../models/financials.js";

// mongoose
//   .connect("mongodb://127.0.0.1:27017/stockDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.log("Error connecting to MongoDB:", error);
//   });

async function runScript() {
  console.log("Script is Running");
  getSymbols()
    .then(async (data) => {
      const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
      });
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);

      data.map(async (stock) => {
        if (
          stock.symbol.length == 4 &&
          stock.market_type == "M" &&
          stock.symbol == 4321
        ) {
          var url =
            "https://www.saudiexchange.sa/wps/portal/saudiexchange/hidden/company-profile-main/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz83d2MXA0C3SydAl1c3Q0NvE30I4EKzBEKDMKcTQzMDPxN3H19LAzdTU31w8syU8v1wwkpK8hOMgUA-oskdg!!/?companySymbol=" +
            stock.symbol;
          await page.goto(url);

          // Extract data
          const selector = "#statementofincome";
          await page.waitForSelector(selector);
          await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
              element.scrollTop = element.offsetHeight;
              console.error(`Scrolled to selector ${selector}`);
            } else {
              console.error(`cannot find selector ${selector}`);
            }
          }, selector);
          await page.waitForTimeout(1500);
          await page.click("#statementofincome");
          await page.waitForTimeout(1500);
          await page.click("#cashflow");
          await page.waitForTimeout(1500);

          const data = await page.evaluate(() => {
            const tableRows = Array.from(
              document.querySelectorAll(".tableStyle table tr")
            );

            return tableRows.map((row) => {
              const columns = Array.from(row.querySelectorAll("td,th"));
              return columns.map((column) => column.innerText);
            });
          });
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
              data[i][j] = data[i][j].replace(/\t|\n/g, "");
            }
          }
          // Find indexes
          const balanceSheetIndex = data.findIndex(
            (row) => row[0] === "Balance Sheet"
          );
          const incomeStatementIndex = data.findIndex(
            (row) => row[0] === "Statement of Income"
          );
          const cashFlowIndex = data.findIndex((row) => row[0] === "Cash Flow");
          const endIndex = data.findIndex((row) => row[0] === "Trading Date");

          // Extract the dividend data
          const dividendData = data.slice(1, balanceSheetIndex);
          // Extract the balance sheet data
          const balanceSheetData = data.slice(
            balanceSheetIndex,
            incomeStatementIndex
          );
          // Extract the income statement data
          const incomeStatementData = data.slice(
            incomeStatementIndex,
            cashFlowIndex
          );
          // Extract the cash flow data
          const cashFlowData = data.slice(cashFlowIndex, endIndex);

          // console.log({
          //   dividendData,
          //   balanceSheetData,
          //   incomeStatementData,
          //   cashFlowData,
          // });

          // fs.writeFileSync("data.json", JSON.stringify(data));
          await saveStockFinancials(stock, {
            dividendData,
            balanceSheetData,
            incomeStatementData,
            cashFlowData,
          });
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
async function getSymbols() {
  try {
    const response = await fetch(
      "https://www.saudiexchange.sa/tadawul.eportal.theme.helper/ThemeSearchUtilityServlet"
    );
    const data = await response.json();
    const filteredData = data.filter((item) => item.market_type === "M");

    return filteredData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
async function getSymbolsWithSectors() {
  try {
    const response = await fetch(
      "https://www.saudiexchange.sa/wps/portal/saudiexchange/ourmarkets/main-market-watch/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz8LVxcnA0C3bwtPLwM_I0MzMz1w1EVGAQHmAIVBPga-xgEGbgbmOlHEaPfAAdwNCCsPwpNia-7mUGgn2Ogv5G5qYFBsBG6AixOBCvA44bg1Dz9gtzQCIPMgHQAsqCDtA!!/p0/IZ7_IPG41I82KGASC06S67RB9A0080=CZ6_5A602H80O8DDC0QFK8HJ0O2067=NJgetMainNomucMarketDetails=/?sectorParameter=all&tableViewParameter=1&iswatchListSelected=NO&requestLocale=en&_=1692824593966"
    );
    const data = await response.json();
    const dataItems = data.data || [];

    // Extract the "sectorName" and "companyRef" fields for each item
    const extractedInfo = dataItems.map((item) => ({
      sectorName: item.sectorName,
      companyRef: item.companyRef,
      acrynomName: item.acrynomName,
      netChange: item.netChangeModified,
      highPrice: item.highPriceModified,
      lowPrice: item.lowPriceModified,
      precentChange: item.precentChangeModified,
      previousClosePrice: item.previousClosePrice,
      todayClosePrice: item.todayClosePrice,
      todayOpen: item.todayOpenModified,
      previousClosePrice: item.previousClosePrice,
    }));
    return extractedInfo;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getFinancialsDataForStocks() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    const symbols = await getSymbols();

    for (let i = 0; i < symbols.length; i++) {
      if (symbols[i].market_type == "M") {
        var symbol = symbols[i].symbol;
        var url =
          "https://www.saudiexchange.sa/wps/portal/saudiexchange/hidden/company-profile-main/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz83d2MXA0C3SydAl1c3Q0NvE30I4EKzBEKDMKcTQzMDPxN3H19LAzdTU31w8syU8v1wwkpK8hOMgUA-oskdg!!/?companySymbol=" +
          symbol;
        await page.goto(url);
        // await page.waitForNavigation({ waitUntil: "networkidle2" });

        // Extract data
        const selector = "#statementofincome";
        await page.waitForSelector(selector);
        // scroll selector into view
        await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          if (element) {
            element.scrollTop = element.offsetHeight;
            console.error(`Scrolled to selector ${selector}`);
          } else {
            console.error(`cannot find selector ${selector}`);
          }
        }, selector);
        await page.waitForTimeout(1500);
        await page.click("#statementofincome");
        await page.waitForTimeout(1500);
        await page.click("#cashflow");
        await page.waitForTimeout(1500);

        const data = await page.evaluate(() => {
          const tableRows = Array.from(
            document.querySelectorAll(".tableStyle table tr")
          );

          return tableRows.map((row) => {
            const columns = Array.from(row.querySelectorAll("td,th"));
            return columns.map((column) => column.innerText);
          });
        });
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            data[i][j] = data[i][j].replace(/\t|\n/g, "");
          }
        }

        const balanceSheetIndex = data.findIndex(
          (row) => row[0] === "Balance Sheet"
        );
        const incomeStatementIndex = data.findIndex(
          (row) => row[0] === "Statement of Income"
        );
        const cashFlowIndex = data.findIndex((row) => row[0] === "Cash Flow");
        const endIndex = data.findIndex((row) => row[0] === "Trading Date");
        // Extract the dividend data
        const dividendData = data.slice(1, balanceSheetIndex);
        // Extract the balance sheet data
        const balanceSheetData = data.slice(
          balanceSheetIndex,
          incomeStatementIndex
        );
        // Extract the income statement data
        const incomeStatementData = data.slice(
          incomeStatementIndex,
          cashFlowIndex
        );
        // Extract the cash flow data
        const cashFlowData = data.slice(cashFlowIndex, endIndex);
        balanceSheetData[0][1] = "2023-03-31";
        // console.log({
        //   dividendData,
        //   balanceSheetData,
        //   incomeStatementData,
        //   cashFlowData,
        // });

        // await saveStockFinancials(symbols[i], {
        //   dividendData,
        //   balanceSheetData,
        //   incomeStatementData,
        //   cashFlowData,
        // });

        // fs.writeFileSync("data.json", JSON.stringify(data));
        // return {
        //   dividendData,
        //   balanceSheetData,
        //   incomeStatementData,
        //   cashFlowData,
        // };
      }
    }
  } catch (e) {
    console.error("scrape faild!: \n", e);
  } finally {
    await browser?.close();
  }
}
async function saveStockFinancials(stock, financialsData) {
  try {
    let numberOfColumns = financialsData.balanceSheetData[0].length;
    const balanceSheetColumnData = [];
    for (let columnIndex = 1; columnIndex < numberOfColumns; columnIndex++) {
      const column = financialsData.balanceSheetData.map(
        (row) => row[columnIndex]
      );
      balanceSheetColumnData.push(column);
    }
    let incomeStatementColumnData = [];
    numberOfColumns = financialsData.incomeStatementData[0].length;
    for (let columnIndex = 1; columnIndex < numberOfColumns; columnIndex++) {
      const column = financialsData.incomeStatementData.map(
        (row) => row[columnIndex]
      );
      incomeStatementColumnData.push(column);
    }

    let cashFlowColumnData = [];
    numberOfColumns = financialsData.cashFlowData[0].length;
    for (let columnIndex = 1; columnIndex < numberOfColumns; columnIndex++) {
      const column = financialsData.cashFlowData.map((row) => row[columnIndex]);
      cashFlowColumnData.push(column);
    }

    let dividendColumnData = [];
    numberOfColumns = financialsData.dividendData[0].length;
    for (let columnIndex = 1; columnIndex < numberOfColumns; columnIndex++) {
      const column = financialsData.dividendData.map((row) => row[columnIndex]);
      dividendColumnData.push(column);
    }

    for (let i = 0; i < numberOfColumns - 1; i++) {
      let balanceSheetColumn = balanceSheetColumnData[i];
      let incomeStatementColumn = incomeStatementColumnData[i];
      let cashFlowColumn = cashFlowColumnData[i];
      let dividendColumn = dividendColumnData[i];
      console.log(stock.symbol);
      const stockData = {
        symbol: stock.symbol,
        companyNameEN: stock.companyNameEN,
        companyNameAR: stock.companyNameAR,
        market_type: stock.market_type,
        tradingNameEn: stock.tradingNameEn,
        tradingNameAr: stock.tradingNameAr,
        dividends: [
          {
            announced_date: dividendColumn[0],
            eligibility_date: dividendColumn[1],
            distribution_date: dividendColumn[2],
            distribution_way: dividendColumn[3],
            dividend_per_share: dividendColumn[4],
          },
        ],
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
      try {
        const stock = await StockFinancials.findOne({
          symbol: stockData.symbol,
        }).exec();
        if (stock) {
          const existingYear = stock.balanceSheet.some(
            (balanceSheetData) =>
              balanceSheetData.year === stockData.balanceSheet[0].year
          );
          if (!existingYear) {
            stock.balanceSheet.push(stockData.balanceSheet[0]);
            stock.balanceSheetQuarterly.push(
              stockData.balanceSheetQuarterly[0]
            );
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
  } catch (err) {
    throw err;
  }
}

export { getSymbols, getSymbolsWithSectors, runScript };

// Extract the Balance Sheet table data
// const balanceSheetData = await page.evaluate(() => {
//   const tableRows = Array.from(
//     document.querySelectorAll(".tableStyle table tr")
//   );

//   return tableRows.map((row) => {
//     const columns = Array.from(row.querySelectorAll("td,th"));
//     return columns.map((column) => column.innerText);
//   });
// });
// for (let i = 0; i < balanceSheetData.length; i++) {
//   for (let j = 0; j < balanceSheetData[i].length; j++) {
//     balanceSheetData[i][j] = balanceSheetData[i][j].replace(/\t|\n/g, "");
//   }
// }
// console.log(JSON.stringify(balanceSheetData));
// fs.writeFileSync("balanceSheet.json", JSON.stringify(balanceSheetData));

// async function run() {
//   try {
//     const browser = await puppeteer.launch({
//       headless: false,
//       defaultViewport: null,
//     });
//     const page = await browser.newPage();
//     page.setDefaultNavigationTimeout(2 * 60 * 1000);
//     await page.setViewport({
//       width: 1200,
//       height: 800,
//     });
//     await page.goto(url);
//     const values = await page.evaluate(async () => {
//       // iterate through the table rows
//       const trs = Array.from(
//         document.querySelectorAll(".financials_Tab_Dtl_box tbody tr")
//       );
//       const content = [];
//       // iterate through each row of table
//       for (const tr of trs) {
//         const tds = Array.from(tr.querySelectorAll("td"));
//         const data = tds.map((td) => td.innerText);
//         // push the data
//         content.push(data);
//       }
//       return content;
//     });
//     console.log(JSON.stringify(values));
//     return values;
//   } catch (e) {
//     console.error("scrape faild!: \n", e);
//   } finally {
//     await browser?.close();
//   }
// }
