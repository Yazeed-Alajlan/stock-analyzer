import mongoose from "mongoose";
import StockInformation from "./models/stockInformation.js";
import StockPrices from "./models/stockPrices.js";
import { runScript, getStocksInformation } from "./scraper/tadawul.js";
import puppeteer from "puppeteer";
import fs from "fs";
import yahooFinance from "yahoo-finance2";
import moment from "moment-timezone";

mongoose
  .connect("mongodb://127.0.0.1:27017/stockDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

async function runStockInformatioScript() {
  await updatedStocksInformation();
  await updatedStockSummary();
  await updatedStocksCapital();
  // try {
  //   console.log("Script is Running");
  //   const stocksData = await getStocksInformation();
  //   const browser = await puppeteer.launch({
  //     headless: false,
  //     defaultViewport: null,
  //   });
  //   const page = await browser.newPage();
  //   page.setDefaultNavigationTimeout(2 * 60 * 1000);

  //   for (const stock of stocksData) {
  //     try {
  //       if (
  //         stock.symbol.length == 4 &&
  //         stock.market_type == "M" &&
  //         // stock.symbol == "2030" &&
  //         !stock.companyNameEN.includes("REIT")
  //       ) {
  //         var url =
  //           "https://www.saudiexchange.sa/wps/portal/saudiexchange/hidden/company-profile-main/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz83d2MXA0C3SydAl1c3Q0NvE30I4EKzBEKDMKcTQzMDPxN3H19LAzdTU31w8syU8v1wwkpK8hOMgUA-oskdg!!/?companySymbol=" +
  //           stock.symbol;
  //         console.log(stock.symbol);
  //         // await page.goto(url);

  //         // await getForeignOwnership(stock, browser, page);
  //         // await getStockProfile(stock, browser, page);
  //       }
  //     } catch (error) {
  //       console.error("Error in loop iteration:", error);
  //       continue; // Skip to the next iteration
  //     }
  //   }

  //   await browser.close();
  //   console.log("Script completed successfully");
  // } catch (error) {
  //   console.error("Error:", error);
  // }
}

// Stocks Information ------------------------------------------------------------------------------------------------------------

async function updatedStocksInformation() {
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
        const existingStock = await StockInformation.findOne({
          symbol: stockInformation.symbol,
        }).exec();

        if (existingStock) {
          // Check if the data is the same, if not, update it
          const isDataSame =
            existingStock.sectorNameAr === stockInformation.sectorNameAr &&
            existingStock.tradingNameAr === stockInformation.tradingNameAr &&
            existingStock.companyNameAR === stockInformation.companyNameAR &&
            existingStock.sectorNameEn === stockInformation.sectorNameEn &&
            existingStock.tradingNameEn === stockInformation.tradingNameEn &&
            existingStock.companyNameEN === stockInformation.companyNameEN;

          if (!isDataSame) {
            // Update the existing stock information
            await StockInformation.updateOne(
              { symbol: stockInformation.symbol },
              stockInformation
            ).exec();
            console.log(
              "Stock Information Updated" + "-----" + stockInformation.symbol
            );
          } else {
            console.log(
              "Skipping Update, Stock Information is the same" +
                "-----" +
                stockInformation.symbol
            );
          }
        } else {
          // Stock does not exist, add new stock information
          const newStockInformation = new StockInformation(stockInformation);
          await newStockInformation.save();
          console.log(
            "New Stock Information Is Added" + "-----" + stockInformation.symbol
          );
        }
      } catch (error) {
        console.error("Error retrieving/updating stock:", error);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
async function updatedStockSummary() {
  const jsonData = fs.readFileSync("stockData.json", "utf8");
  const data = JSON.parse(jsonData);
  for (const company of data.items) {
    console.log(company.symbol_code);
    try {
      const stock = await StockInformation.findOne({
        symbol: company.symbol_code,
      }).exec();
      if (stock) {
        // Check if a summary with the same trade_date already exists
        const existingSummary = stock.summary.find(
          (summary) =>
            summary.trade_date.getTime() ===
            new Date(company.today_points.trade_date).getTime()
        );

        if (!existingSummary) {
          // Create an object with all the fields
          const newSummaryData = {
            trade_date: new Date(company.today_points.trade_date),
            open: company.today_points.open.toString(),
            close: company.today_points.close.toString(),
            high: company.today_points.high.toString(),
            low: company.today_points.low.toString(),
            previous_close: company.today_points.previous_close.toString(),
            change_value: company.today_points.change_value.toString(),
            change_ratio: company.today_points.change_ratio.toString(),
            trade_count: company.today_points.trade_count.toString(),
            trade_value: company.today_points.trade_value.toString(),
            trade_volume: company.today_points.trade_volume.toString(),
            fifty_two_week_high:
              company.today_points.fifty_two_week_high.toString(),
            fifty_two_week_low:
              company.today_points.fifty_two_week_low.toString(),
            previous_close_7_days_back:
              company.today_points.previous_close_7_days_back.toString(),
            previous_close_30_days_back:
              company.today_points.previous_close_30_days_back.toString(),
            previous_close_365_days_back:
              company.today_points.previous_close_365_days_back.toString(),
            return_value_last_week:
              company.today_points.return_value_last_week.toString(),
            return_value_last_month:
              company.today_points.return_value_last_month.toString(),
            return_value_last_year:
              company.today_points.return_value_last_year.toString(),
            return_last_week: company.today_points.return_last_week.toString(),
            return_last_month:
              company.today_points.return_last_month.toString(),
            return_last_year: company.today_points.return_last_year.toString(),
            daily_price_to_earnings:
              company.today_points.daily_price_to_earnings.toString(),
            daily_price_to_book_value:
              company.today_points.daily_price_to_book_value.toString(),
            daily_market_capitalization:
              company.today_points.daily_market_capitalization.toString(),
            basic_earnings_per_share_ttm:
              company.today_points.basic_earnings_per_share_ttm.toString(),
            book_value_per_share_ttm:
              company.today_points.book_value_per_share_ttm.toString(),
            // Include other fields as needed
          };

          // Push the new data to the "summary" array
          stock.summary.push(newSummaryData);

          // Save the updated document back to the database
          await stock.save();
        }
      }
    } catch (error) {
      console.error("Error retrieving stock:", error);
    }
  }
}
async function updatedStocksCapital() {
  try {
    const symbols = await getStocksInformation();
    for (const stock of symbols) {
      const symbol = stock.symbol;
      const response = await fetch(
        `https://www.saudiexchange.sa/wps/portal/saudiexchange/hidden/company-profile-main/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz83d2MXA0C3SydAl1c3Q0NvE30w1EVGAQHmAIVBPga-xgEGbgbmOlHEaPfAAdwNCCsPwqvEndzdAVYnAhWgMcNXvpR6Tn5SZDwyCgpKbBSNVA1KElMSSwvzVEFujE5P7cgMa8yuDI3KR-oyMjA2EA_ODVPvyA3NMIgMyA3XNdREQAWgPPv/p0/IZ7_5A602H80O0VC4060O4GML81GV7=CZ6_5A602H80OGF2E0QF9BQDEG10K4=NJgetCorporateAction=/?indexSymbol=${stock.symbol}&language=en&issueType=Corporate%20Action`
      );
      const data = await response.json();
      const extractedInfo = data.pastCorporateBeans.map(async (item) => {
        try {
          const existingStock = await StockInformation.findOne({
            symbol: symbol,
          }).exec();

          if (existingStock) {
            // Check if the data already exists in the 'capital' array
            const capitalExists = existingStock.capital.some((capitalData) => {
              return (
                capitalData.announceDate === item.announceDate &&
                capitalData.issueTypeDesc === item.issueTypeDesc &&
                capitalData.dueDate === item.dueDate &&
                capitalData.newCApital === item.newCApital &&
                capitalData.prevCApital === item.prevCApital &&
                capitalData.dueDateCompare === item.dueDateCompare
              );
            });

            if (!capitalExists) {
              // Data does not exist, add it to the 'capital' array
              const newCapitalData = {
                announceDate: item.announceDate,
                issueTypeDesc: item.issueTypeDesc,
                dueDate: item.dueDate,
                newCApital: item.newCApital,
                prevCApital: item.prevCApital,
                dueDateCompare: item.dueDateCompare,
              };
              existingStock.capital.push(newCapitalData);
              await existingStock.save();
              console.log(
                `Added new capital data for ${symbol}:`,
                newCapitalData
              );
            } else {
              console.log(`Capital data already exists for ${symbol}:`, item);
            }
          } else {
            console.log(`Stock not found for ${symbol}`);
          }
        } catch (error) {
          console.error("Error processing stock:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
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
    await page.waitForTimeout(1500);

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
        "#layoutContainers > div.wptheme1Col > div.component-container.wpthemeFull.wpthemeRow.id-Z7_5A602H80OGF2E0QF9BQDEG10K7 > div > section > section:nth-child(15) > div.fundInfo > div.inspectionBox > p"
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
async function saveStockProfile(stockData, stockProfileData) {
  console.log(stockProfileData);

  try {
    const stock = await StockInformation.findOne({
      symbol: stockData.symbol,
    }).exec();

    if (stock) {
      // Check if a profile with the same "Last Update" already exists
      const existingProfile = stock.profile.find(
        (profile) => profile.lastUpdate === stockProfileData["Last Update"]
      );

      if (existingProfile) {
        console.log("Duplicate record found. Not adding new data.");
      } else {
        // If not, add the new profile
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
      }
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

// Stocks Prices ------------------------------------------------------------------------------------------------------------

async function saveStockPrices() {
  try {
    const symbols = await getStocksInformation();
    for (const stock of symbols) {
      console.log(stock.symbol);
      const symbol = stock.symbol;
      const period1 = "2022-01-01";
      const period2 = new Date().toISOString().split("T")[0];
      const queryOptions = { period1, period2 };
      const result = await yahooFinance._chart(
        stock.symbol + ".SR",
        queryOptions
      );
      if (!result || !result.quotes || result.quotes.length === 0) {
        throw new Error("Invalid stock symbol or no data available.");
      }
      // Check if a document with the same symbol already exists in the database
      const existingDocument = await StockPrices.findOne({ symbol });
      console.log(result.quotes);
      if (existingDocument) {
        // If the document exists, update it with the new data
        for (const quote of result.quotes) {
          const existingDataPoint = existingDocument.quotes.find(
            (dataPoint) =>
              dataPoint.date.toLocaleDateString("en-GB") ===
              new Date(quote.date).toLocaleDateString("en-GB")
          );
          if (!existingDataPoint) {
            existingDocument.quotes.push({
              date: new Date(quote.date), // Convert the date string to a Date object
              open: quote.open,
              close: quote.close,
              high: quote.high,
              low: quote.low,
              volume: quote.volume,
              adjclose: quote.adjclose,
            });
          }
        }
        await existingDocument.save();
      } else {
        // If the document does not exist, create a new one with the new data
        const stockPriceData = {
          symbol: symbol,
          quotes: result.quotes.map((quote) => ({
            date: new Date(quote.date), // Convert the date string to a Date object
            open: quote.open,
            close: quote.close,
            high: quote.high,
            low: quote.low,
            volume: quote.volume,
            adjclose: quote.adjclose,
          })),
        };
        const stockPrice = new StockPrices(stockPriceData);
        await stockPrice.save();
      }
    }
  } catch (error) {
    console.error("Error fetching and saving stock data:", error);
    res.status(500).json({ error: "Unable to fetch and save stock data" });
  }
}

async function saveStockPricesHorly() {
  try {
    const symbols = await getStocksInformation();
    for (const stock of symbols) {
      console.log(stock.symbol);
      const symbol = stock.symbol;
      // if (symbol != "4321") continue;

      const period1 = "2022-01-01";
      const period2 = new Date().toISOString().split("T")[0];
      const queryOptions = { period1, period2, interval: "1h" };

      const result = await yahooFinance._chart(
        stock.symbol + ".SR",
        queryOptions
      );
      // console.log(result);
      if (!result || !result.quotes || result.quotes.length === 0) {
        throw new Error("Invalid stock symbol or no data available.");
      }

      const existingStockPrice = await StockPrices.findOne({
        symbol: symbol,
        "quotes.date": {
          $in: result.quotes.map((quote) => new Date(quote.date)),
        },
      });

      if (existingStockPrice) {
        console.log("Data already exists for symbol:", symbol);
        continue; // Skip saving data if it already exists
      }

      const stockPriceData = {
        symbol: symbol,
        quotes: result.quotes.map((quote) => ({
          date: new Date(quote.date),
          open: quote.open,
          close: quote.close,
          high: quote.high,
          low: quote.low,
          volume: quote.volume,
          adjclose: quote.adjclose,
        })),
      };

      const stockPrice = new StockPrices(stockPriceData);
      await stockPrice.save();
    }
  } catch (error) {
    console.error("Error fetching and saving stock data:", error);
  }
}

// saveStockPricesHorly();
// runStockInformatioScript();
