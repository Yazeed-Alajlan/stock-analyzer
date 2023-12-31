import { useState } from "react";
import { motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";

import Sidebar from "components/routing/Sidebar";
import StockPage from "pages/StockPage/StockPage";
import Header from "components/routing/Header";
import { Container } from "react-bootstrap";
import HomePage from "pages/HomePage/HomePage";
import StocksPage from "./pages/StocksPage/StocksPage";
import axios from "axios";
import ComparisonPage from "pages/ComparisonPage/ComparisonPage";
import TechnicalAnalysisPage from "pages/TechnicalAnalysisPage/TechnicalAnalysisPage";
import StockChart from "pages/StockPage/components/chart/StockChart";
import Dividend from "pages/StockPage/components/profits_and_distributions/Dividend";
import StockInformation from "pages/StockPage/components/information/StockInformation";
import Financials from "pages/StockPage/components/financials/Financials";
import HawkesProcess from "pages/TechnicalAnalysisPage/components/HawkesProcess";
import JapaneseCandlestick from "pages/TechnicalAnalysisPage/components/JapaneseCandlestick";
import ConsolidatingStocks from "pages/TechnicalAnalysisPage/components/ConsolidatingStocks";
import MonthlyReturns from "pages/TechnicalAnalysisPage/components/MonthlyReturns";
import TechnicalAnalysisLayout from "components/routing/TechnicalAnalysisLayout";
import TechnicalAnalysisAutomation from "pages/TechnicalAnalysisPage/components/TechnicalAnalysisAutomation";
import Vsa from "pages/TechnicalAnalysisPage/components/Vsa";
import StockAnalysis from "pages/StockPage/components/analysis/StockAnalysis";
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
      className="bg-light p-0 dark-theme"
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
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/companies/:sector" element={<StocksPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />

          <Route element={<TechnicalAnalysisLayout />}>
            <Route
              path="/technical-analysis"
              element={<TechnicalAnalysisPage />}
            />
            <Route
              path="/consolidating-stocks"
              element={<ConsolidatingStocks />}
            />
            <Route
              path="/japanese-candlestick"
              element={<JapaneseCandlestick />}
            />
            <Route path="/hawkes-process" element={<HawkesProcess />} />
            <Route path="/monthly-returns" element={<MonthlyReturns />} />
            <Route
              path="technical-analysis-automation"
              element={<TechnicalAnalysisAutomation />}
            />
            <Route path="vsa" element={<Vsa />} />
          </Route>

          <Route path="/companies/:sector/:symbol" element={<StockPage />}>
            <Route path="information" element={<StockInformation />} />
            <Route path="financials" element={<Financials />} />
            <Route path="chart" element={<StockChart />} />
            <Route path="dividend" element={<Dividend />} />
            <Route path="analysis" element={<StockAnalysis />} />
          </Route>
        </Routes>
      </motion.div>
      <Sidebar {...{ sideBar, setSideBar }} />
    </Container>
  );
}

export default App;
