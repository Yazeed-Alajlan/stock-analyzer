import { useState } from "react";
import { motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";

import Sidebar from "components/routing/Sidebar";
import CusotmModal from "components/utils/CusotmModal";
import StockPage from "pages/StockPage/StockPage";
import { Header } from "components/routing/Header";
import { Container } from "react-bootstrap";
import HomePage from "pages/HomePage/HomePage";
import StocksPage from "./pages/StocksPage/StocksPage";
import axios from "axios";
import ComparisonPage from "pages/ComparisonPage/ComparisonPage";
import TechnicalAnalysisPage from "pages/TechnicalAnalysisPage/TechnicalAnalysisPage";
import StockChart from "pages/StockPage/components/StockChart";
import Dividend from "pages/StockPage/components/Dividend";
import StockInformation from "pages/StockPage/components/StockInformation";
import FinancialesTable from "pages/StockPage/components/FinancialsTable";
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
      className="bg-light p-0"
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
          <Route path="/companies/:sector" element={<StocksPage />} />
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
