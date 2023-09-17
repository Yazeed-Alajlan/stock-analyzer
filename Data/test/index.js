import puppeteer from "puppeteer";
import fs from "fs";

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
  try {
    console.log("Script is Running");
    const data = await getSymbolsWithSectors();
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    for (const stock of data) {
      try {
        if (stock.companyRef == "1030") {
          var url =
            "https://www.saudiexchange.sa/wps/portal/saudiexchange/hidden/company-profile-main/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz83d2MXA0C3SydAl1c3Q0NvE30I4EKzBEKDMKcTQzMDPxN3H19LAzdTU31w8syU8v1wwkpK8hOMgUA-oskdg!!/?companySymbol=" +
            stock.companyRef;
          await page.goto(url);
          console.log(url);
          // await getForeignOwnership(stock, browser, page);
          await getFinancialsDataForStocks(stock, browser, page);
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

    console.log(
      dividendData,
      balanceSheetData,
      incomeStatementData,
      cashFlowData
    );

    fs.writeFileSync("data.json", JSON.stringify(data));
  } catch (e) {
    console.error("scrape faild!: \n", e);
  } finally {
    await browser?.close();
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
runScript();
