import { useState } from "react";
import { isEqual } from "lodash";
import CustomButton from "../utils/CustomButton";
import { Table } from "react-bootstrap";
const BalanceSheet = ({ quarterlyData, annualData }) => {
  const [data, setData] = useState(quarterlyData);
  const [title, setTitle] = useState("Show Annual Data");

  const years = data.map((item) => item.year);
  const currentAssets = data.map((item) => item.current_assets);
  const inventory = data.map((item) => item.inventory);
  const investments = data.map((item) => item.investments);
  const fixedAssets = data.map((item) => item.fixed_assets);
  const otherAssets = data.map((item) => item.other_assets);
  const totalAssets = data.map((item) => item.total_assets);
  const currentLiabilities = data.map((item) => item.current_liabilities);
  const nonCurrentLiabilities = data.map(
    (item) => item.non_current_liabilities
  );
  const otherLiabilities = data.map((item) => item.other_liabilities);
  const shareholdersEquity = data.map((item) => item.shareholders_equity);
  const totalLiabilitiesAndShareholderEquity = data.map(
    (item) => item.total_liabilities_and_shareholder_equity
  );
  const minorityInterests = data.map((item) => item.minority_interests);
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
            <th>Balance Sheet</th>
            {years.map((year) => (
              <th key={year}>{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Current Assets</td>
            {currentAssets.map((asset, index) => (
              <td key={index}>{asset}</td>
            ))}
          </tr>
          <tr>
            <td>Inventory</td>
            {inventory.map((inv, index) => (
              <td key={index}>{inv}</td>
            ))}
          </tr>
          <tr>
            <td>Investments</td>
            {investments.map((investment, index) => (
              <td key={index}>{investment}</td>
            ))}
          </tr>
          <tr>
            <td>Fixed Assets</td>
            {fixedAssets.map((fixedAsset, index) => (
              <td key={index}>{fixedAsset}</td>
            ))}
          </tr>
          <tr>
            <td>Other Assets</td>
            {otherAssets.map((otherAsset, index) => (
              <td key={index}>{otherAsset}</td>
            ))}
          </tr>
          <tr>
            <td>Total Assets</td>
            {totalAssets.map((totalAsset, index) => (
              <td key={index}>{totalAsset}</td>
            ))}
          </tr>
          <tr>
            <td>Current Liabilities</td>
            {currentLiabilities.map((liability, index) => (
              <td key={index}>{liability}</td>
            ))}
          </tr>
          <tr>
            <td>Non-Current Liabilities</td>
            {nonCurrentLiabilities.map((liability, index) => (
              <td key={index}>{liability}</td>
            ))}
          </tr>
          <tr>
            <td>Other Liabilities</td>
            {otherLiabilities.map((liability, index) => (
              <td key={index}>{liability}</td>
            ))}
          </tr>
          <tr>
            <td>Shareholders' Equity</td>
            {shareholdersEquity.map((equity, index) => (
              <td key={index}>{equity}</td>
            ))}
          </tr>
          <tr>
            <td>Total Liabilities and Shareholders' Equity</td>
            {totalLiabilitiesAndShareholderEquity.map((total, index) => (
              <td key={index}>{total}</td>
            ))}
          </tr>
          <tr>
            <td>Minority Interests</td>
            {minorityInterests.map((interest, index) => (
              <td key={index}>{interest}</td>
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
        {/* <tbody>
          {Object.keys(data[0]).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              {data.map((item) => (
                <td key={item._id.$oid}>{item[key]}</td>
              ))}
            </tr>
          ))}
        </tbody> */}
      </Table>
      <CustomButton onClick={toggleData} title={title} />
    </div>
  );
};

export default BalanceSheet;
