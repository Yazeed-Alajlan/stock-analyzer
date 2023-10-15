import puppeteer from "puppeteer";
import StockFinancials from "../models/stockFinancials.js";
import StockInformation from "../models/stockInformation.js";

async function runScript() {
  try {
    console.log("Script is Running");
    const data = await getSymbols();
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    for (const stock of data) {
      try {
        if (
          stock.symbol.length == 4 &&
          stock.market_type == "M" &&
          stock.symbol == "4321" &&
          !stock.companyNameEN.includes("REIT")
        ) {
          var url =
            "https://www.saudiexchange.sa/wps/portal/saudiexchange/hidden/company-profile-main/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz83d2MXA0C3SydAl1c3Q0NvE30I4EKzBEKDMKcTQzMDPxN3H19LAzdTU31w8syU8v1wwkpK8hOMgUA-oskdg!!/?companySymbol=" +
            stock.symbol;
          console.log(stock.symbol);
          await page.goto(url);
          await page.waitForSelector("#statementofincome", {
            timeout: 60000,
          });

          // await getFinancialsDataForStocks(stock, browser, page);
          await getForeignOwnership(stock, browser, page);
          // await getStockProfile(stock, browser, page);
        }
      } catch (error) {
        console.error("Error in loop iteration:", error);
        continue; // Skip to the next iteration
      }
    }

    await browser.close();
    console.log("Script completed successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}
async function getForeignOwnership(stock, browser, page) {
  try {
    // Extract data
    const selector = ".shareholding";
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
    await page.waitForTimeout(2500);
    await page.click(
      "#layoutContainers > div.wptheme1Col > div.component-container.wpthemeFull.wpthemeRow.id-Z7_5A602H80OGF2E0QF9BQDEG10K7 > div > section > section:nth-child(13) > div.shareholding > div > div.shareholding_tab > ul > li:nth-child(2)"
    );

    await page.waitForTimeout(2500);

    const data = await page.$eval(
      "#layoutContainers > div.wptheme1Col > div.component-container.wpthemeFull.wpthemeRow.id-Z7_5A602H80OGF2E0QF9BQDEG10K7 > div > section > section:nth-child(13) > div.shareholding > div > div.shareholding_tab_dtl > div:nth-child(2) > div.foreign_ownership > div.total_foreign_ownership > ul > li:nth-child(1) > div > div.actual > strong",
      (element) => element.textContent
    );
    saveStockforeignOwnership(stock, data.trim());
  } catch (e) {
    console.error("scrape faild!: \n", e);
  }
}
async function getFinancialsDataForStocks(stock, browser, page) {
  try {
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
    const incomeStatementData = data.slice(incomeStatementIndex, cashFlowIndex);
    // Extract the cash flow data
    const cashFlowData = data.slice(cashFlowIndex, endIndex);

    console.log(stock.symbol);
    await saveStockData(stock, {
      dividendData,
      balanceSheetData,
      incomeStatementData,
      cashFlowData,
    });

    // fs.writeFileSync("data.json", JSON.stringify(data));
  } catch (e) {
    console.error("scrape faild!: \n", e);
  }
}
async function getStockProfile(stock, browser, page) {
  try {
    // Extract data
    const selector = ".inspectionBox";
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

    // Extract data from the page
    const companyInfo = await page.evaluate(() => {
      const ul = document.querySelector(".inspectionBox ul");
      const items = ul.querySelectorAll("li");

      const data = {};
      items.forEach((item) => {
        const key = item.querySelector("span").textContent.trim();
        const value = item.querySelector("strong").textContent.trim();
        data[key] = value;
      });

      return data;
    });
    const extractedData = await page.evaluate(() => {
      const element = document.querySelector(
        "#layoutContainers > div.wptheme1Col > div.component-container.wpthemeFull.wpthemeRow.id-Z7_5A602H80OGF2E0QF9BQDEG10K7 > div > section > section:nth-child(14) > div.fundInfo > div.inspectionBox > p"
      );
      let textContent = element.textContent.trim();

      // Remove "Last Update :" prefix
      textContent = textContent.replace("Last Update :", "").trim();

      return textContent;
    });
    companyInfo["Last Update"] = extractedData;

    saveStockProfile(stock, companyInfo);
  } catch (e) {
    console.error("scrape faild!: \n", e);
  }
}
async function runStockInformationScript() {
  try {
    //English Data
    const responseEn = await fetch(
      "https://www.saudiexchange.sa/wps/portal/saudiexchange/ourmarkets/main-market-watch/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz8LVxcnA0C3bwtPLwM_I0MzMz1w1EVGAQHmAIVBPga-xgEGbgbmOlHEaPfAAdwNCCsPwpNia-7mUGgn2Ogv5G5qYFBsBG6AixOBCvA44bg1Dz9gtzQCIPMgHQAsqCDtA!!/p0/IZ7_IPG41I82KGASC06S67RB9A0080=CZ6_5A602H80O8DDC0QFK8HJ0O2067=NJgetMainNomucMarketDetails=/?sectorParameter=&tableViewParameter=1&iswatchListSelected=NO&requestLocale=en&_=1693046894347"
    );
    const dataEn = await responseEn.json();

    //Arabic Data
    const responseAr = await fetch(
      "https://www.saudiexchange.sa/wps/portal/saudiexchange/ourmarkets/main-market-watch/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz8LVxcnA0C3bwtPLwM_I0MzMz1w1EVGAQHmAIVBPga-xgEGbgbmOlHEaPfAAdwNCCsPwpNia-7mUGgn2Ogv5G5qYFBsBG6AixOBCvA44bgxCL9gtzQCIPMgHQAVrLIOQ!!/p0/IZ7_IPG41I82KGASC06S67RB9A0080=CZ6_5A602H80O8DDC0QFK8HJ0O2067=NJgetMainNomucMarketDetails=/?sectorParameter=&tableViewParameter=1&iswatchListSelected=NO&requestLocale=ar&_=1693046920184"
    );
    const dataAr = await responseAr.json();

    for (let index = 0; index < dataAr.data.length; index++) {
      const elementAr = dataAr.data[index];
      const elementEn = dataEn.data[index];
      const stockInformation = {
        symbol: elementAr.companyRef,
        sectorNameAr: elementAr.sectorName,
        tradingNameAr: elementAr.acrynomName,
        companyNameAR: elementAr.companyName,
        sectorNameEn: elementEn.sectorName,
        tradingNameEn: elementEn.acrynomName,
        companyNameEN: elementEn.companyName,
        market_type: "M",
      };
      try {
        const stock = await StockInformation.findOne({
          symbol: stockInformation.symbol,
        }).exec();
        if (stock) {
          console.log("Skipping Add, Stock Information is Added");
        } else {
          const newStockInformation = new StockInformation(stockInformation);
          await newStockInformation.save();
          console.log("New Stock Information Is Added");
        }
      } catch (error) {
        console.error("Error retrieving stock:", error);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
async function getSymbols() {
  try {
    const data = await StockInformation.find({
      companyNameEN: { $not: { $regex: /REIT/i } }, // Case-insensitive check for "REIT"
    });
    return data;
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
async function saveStockData(stock, financialsData) {
  try {
    await saveStockFinancials(stock, financialsData);
    await saveStockDividends(stock, financialsData);
  } catch (error) {
    console.error("Error retrieving stock:", error);
  }
}
async function saveStockFinancials(stock, financialsData) {
  const balanceSheetColumnData = extractDataAsColumns(
    financialsData.balanceSheetData
  );
  const incomeStatementColumnData = extractDataAsColumns(
    financialsData.incomeStatementData
  );
  const cashFlowColumnData = extractDataAsColumns(financialsData.cashFlowData);

  const numberOfColumns = Math.max(
    ...financialsData.balanceSheetData.map((arr) => arr.length)
  );

  for (let i = 0; i < numberOfColumns - 1; i++) {
    const stockData = createStockFinancialsData(
      stock,
      balanceSheetColumnData[i],
      incomeStatementColumnData[i],
      cashFlowColumnData[i]
    );
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
          if (stockData.balanceSheet[0].year !== "REMOVE") {
            stock.balanceSheet.push(stockData.balanceSheet[0]);
            stock.incomeSheet.push(stockData.incomeSheet[0]);
            stock.cashFlow.push(stockData.cashFlow[0]);
          }
          if (stockData.balanceSheetQuarterly[0].year !== "REMOVE") {
            stock.balanceSheetQuarterly.push(
              stockData.balanceSheetQuarterly[0]
            );
            stock.incomeSheetQuarterly.push(stockData.incomeSheetQuarterly[0]);
            stock.cashFlowQuarterly.push(stockData.cashFlowQuarterly[0]);
          }
          await stock.save();
          console.log("New data added to existing record");
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
      console.error("Error retrieving stock:", error);
    }
  }
}
async function saveStockDividends(stock, financialsData) {
  const dividendColumnData = financialsData.dividendData;
  const numberOfColumns = financialsData.dividendData.length;
  for (let i = 0; i < numberOfColumns; i++) {
    const stockData = createStockDividendsData(stock, dividendColumnData[i]);
    try {
      const stock = await StockFinancials.findOne({
        symbol: stockData.symbol,
      }).exec();
      if (stock) {
        const newDividend = stockData.dividends[0];
        if (
          stock.dividends.length === 0 ||
          !stock.dividends.some(
            (dividend) => dividend.announced_date === newDividend.announced_date
          )
        ) {
          stock.dividends.push(newDividend);
          await stock.save();
          console.log("New data added to existing record");
        }
      } else {
        const newData = new StockFinancials(stockData);
        await newData.save();
        console.log("First time");
      }
    } catch (error) {
      console.error("Error retrieving stock:", error);
    }
  }
}
async function saveStockforeignOwnership(stockData, foreignOwnershipData) {
  console.log(foreignOwnershipData);
  try {
    const stock = await StockFinancials.findOne({
      symbol: stockData.symbol,
    }).exec();
    if (stock) {
      stock.foreignOwnership.push({
        date: new Date().toLocaleDateString("en-GB"),
        percentage: foreignOwnershipData,
      });
      await stock.save();
      console.log("New data added to existing record");
    } else {
      const newData = new StockFinancials(stockData);
      newData.foreignOwnership.push(foreignOwnershipData);
      await newData.save();
      console.log("First time");
    }
  } catch (error) {
    console.error("Error retrieving stock:", error);
  }
}
async function saveStockProfile(stockData, stockProfileData) {
  console.log(stockProfileData);

  try {
    const stock = await StockInformation.findOne({
      symbol: stockData.symbol,
    }).exec();
    if (stock) {
      stock.profile.push({
        authorizedCapital: stockProfileData["Authorized Capital (SAR)"],
        issuedShares: stockProfileData["Issued Shares"],
        paidCapital: stockProfileData["Paid Capital (SAR)"],
        parValueShare: stockProfileData["Par Value/Share"],
        paidUpValueShare: stockProfileData["Paid Up Value/Share"],
        lastUpdate: stockProfileData["Last Update"],
      });
      await stock.save();
      console.log("New data added to existing record");
    } else {
      const newData = new StockInformation(stockData);
      newData.profile.push(stockProfileData);
      await newData.save();
      console.log("First time");
    }
  } catch (error) {
    console.error("Error retrieving stock:", error);
  }
}
function createStockDividendsData(stock, dividendColumn) {
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
  };
  return stockData;
}
function createStockFinancialsData(
  stock,
  balanceSheetColumn,
  incomeStatementColumn,
  cashFlowColumn
) {
  const balanceSheetData = getQuarterlyAndAnnuallyData(balanceSheetColumn);
  const incomeStatementData = getQuarterlyAndAnnuallyData(
    incomeStatementColumn
  );
  const cashFlowData = getQuarterlyAndAnnuallyData(cashFlowColumn);

  const stockData = {
    symbol: stock.symbol,
    companyNameEN: stock.companyNameEN,
    companyNameAR: stock.companyNameAR,
    market_type: stock.market_type,
    tradingNameEn: stock.tradingNameEn,
    tradingNameAr: stock.tradingNameAr,
    balanceSheet: [balanceSheetData.annually],
    balanceSheetQuarterly: [balanceSheetData.quarterly],
    incomeSheet: [incomeStatementData.annually],
    incomeSheetQuarterly: [incomeStatementData.quarterly],
    cashFlow: [cashFlowData.annually],
    cashFlowQuarterly: [cashFlowData.quarterly],
  };
  return stockData;
}
function extractDataAsColumns(data) {
  // No data available in table
  if (data.length == 1) return;
  const maxLength = Math.max(...data.map((arr) => arr.length));
  if (maxLength > 0) {
    for (let i = 0; i < data.length; i++) {
      const diff = maxLength - data[i].length;
      if (diff > 0) {
        data[i] = data[i].concat(Array(diff).fill("REMOVE"));
      }
    }
    const columnData = [];
    const keys = data.map((row) => row[0]);
    for (let i = 1; i < maxLength; i++) {
      const columnWithKey = data.map((row, index) => ({
        key: keys[index], // Add a key property with the desired value (in this example, using the index as the key)
        value: row[i], // Assuming you want to retain the existing value in the row[i] property
      }));
      columnData.push(columnWithKey);
    }
    return columnData;
  }
}

function getQuarterlyAndAnnuallyData(data) {
  const halfIndex = Math.ceil(data.length / 2);
  const firstHalf = data.slice(0, halfIndex);
  const secondHalf = data.slice(halfIndex);
  firstHalf[0].key = "year";
  secondHalf[0].key = "year";

  const annually = {};
  for (let i = 0; i < firstHalf.length; i++) {
    const key = firstHalf[i].key.toLowerCase().replace(/\s+/g, "_");
    annually[key] = firstHalf[i].value;
  }

  const quarterly = {};
  for (let i = 0; i < secondHalf.length; i++) {
    const key = secondHalf[i].key.toLowerCase().replace(/\s+/g, "_");
    quarterly[key] = secondHalf[i].value;
  }

  return { annually, quarterly };
}

export {
  getSymbols,
  getSymbolsWithSectors,
  runScript,
  runStockInformationScript,
};

function extractHeadersAsColumns(data) {
  // No data available in table
  if (data.length == 1) return;
  const maxLength = Math.max(...data.map((arr) => arr.length));
  if (maxLength > 0) {
    // Initialize an object to store column data
    const columnData = {};

    // Iterate through the first row to get column names
    const columnNames = data[0];

    // Initialize objects for each column
    for (const columnName of columnNames) {
      columnData[columnName] = {};
    }

    // Iterate through the data rows and populate column data
    for (let i = 1; i < data.length; i++) {
      const rowData = data[i];
      for (let j = 0; j < rowData.length; j++) {
        columnData[columnNames[j]][rowData[0]] = rowData[j];
      }
    }

    return columnData;
  }
}
