import fs from "fs";

console.log("--------------------------------------------------------------");

async function fetchDataAndWriteToFile() {
  // Read the JSON file
  const jsonData = fs.readFileSync("stockInfo.json", "utf8");
  const data = JSON.parse(jsonData);

  for (const company of data.items) {
    console.log(`Company Name: ${company.company_name}`);
    console.log(`GUID: ${company.guid}`);
    console.log("-----------------------------");

    // Define the API URL with the symbol as a variable
    const apiUrl = `https://service.sahmi.sa/api/v1/stocks/${company.guid}/financial-statements/`;

    try {
      // Make a GET request to the API and await the response
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      // Parse the API response as JSON
      const apiData = await response.json();

      // Process the fetched API data here
      console.log("Fetched API Data:");
      console.log(apiData);

      // Write the fetched data to a file and await the file writing operation
      const fileName = `${company.symbol_code}.json`;
      await fs.promises.writeFile(fileName, JSON.stringify(apiData, null, 2));
      console.log(`Data written to ${fileName}`);
    } catch (error) {
      // Handle any errors from the API request or file writing
      console.error("Error:", error);
    }
  }
}

// Call the async function to start fetching and writing data
fetchDataAndWriteToFile().catch((error) => {
  console.error("Unhandled Error:", error);
});
