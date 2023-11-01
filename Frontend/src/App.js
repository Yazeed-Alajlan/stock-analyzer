import { useState } from "react";
import { motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";

import Sidebar from "components/routing/Sidebar";
import CusotmModal from "components/utils/CusotmModal";
import StockPage from "components/StockPage/StockPage";
import { Header } from "components/routing/Header";
import { Container } from "react-bootstrap";
import HomePage from "pages/HomePage";
import MarketSummary from "pages/MarketSummary";
import CompaniesPage from "pages/CompaniesPage";
import StockInformation from "components/StockPage/StockInformation";
import FinancialesTable from "components/StockPage/FinancialsTable";
import axios from "axios";
import StockChart from "components/StockPage/StockChart";
import Dividend from "components/StockPage/Dividend";
import ComparisonPage from "pages/ComparisonPage";
import TechnicalAnalysisPage from "components/TechnicalAnalysis/TechnicalAnalysisPage";
function App() {
  const [sideBar, setSideBar] = useState(false);
  const [modal, setModal] = useState(false);

  const handleClick = async () => {
    try {
      await axios.post("http://localhost:5000/api/register");
      console.log("Request sent successfully");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  return (
    <Container
      fluid
      className="bg-white p-0"
      style={{ minHeight: "100vh", width: "100%" }}
      dir="rtl"
    >
      <motion.div
        animate={{
          scale: sideBar || modal ? 0.8 : 1,
          opacity: sideBar || modal ? 0.5 : 1,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      >
        <Header {...{ sideBar, setSideBar }} />

        {/* <button
          onClick={() => {
            setModal(!modal);
          }}
        >
          OPEN MODAL
        </button> */}
        <button onClick={handleClick}>Register</button>

        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/companies/:sector" element={<CompaniesPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route
            path="/technical-analysis"
            element={<TechnicalAnalysisPage />}
          />

          <Route path="/companies/:sector/:symbol" element={<StockPage />}>
            <Route path="information" element={<StockInformation />} />
            <Route path="financials" element={<FinancialesTable />} />
            <Route path="chart" element={<StockChart />} />
            <Route path="dividend" element={<Dividend />} />
          </Route>
        </Routes>
      </motion.div>
      <Sidebar {...{ sideBar, setSideBar }} />
      <CusotmModal {...{ modal, setModal }} />
    </Container>
  );
}

export default App;
