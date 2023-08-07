import puppeteer from "puppeteer";
import fs from "fs";
const url =
  "https://www.saudiexchange.sa/wps/portal/saudiexchange/hidden/company-profile-main/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTR3NDIw8LAz83d2MXA0C3SydAl1c3Q0NvE30I4EKzBEKDMKcTQzMDPxN3H19LAzdTU31w8syU8v1wwkpK8hOMgUA-oskdg!!/?companySymbol=4321";

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

async function getFinancialsDataForStock() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await page.goto(url);

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
    await page.waitForTimeout(1000);
    await page.click("#statementofincome");
    await page.waitForTimeout(1000);
    await page.click("#cashflow");
    await page.waitForTimeout(1000);

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
    // console.log(JSON.stringify(data));
    fs.writeFileSync("data.json", JSON.stringify(data));
  } catch (e) {
    console.error("scrape faild!: \n", e);
  } finally {
    await browser?.close();
  }
}
getFinancialsDataForStock();

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
