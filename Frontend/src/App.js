import { useState } from "react";
import { motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";

import CustomSidebar from "./components/utils/CustomSidebar";
import CusotmModal from "./components/utils/CusotmModal";
import StockPage from "./components/StockPage/StockPage";
import { Header } from "./components/utils/Header";
import { Container } from "react-bootstrap";
import HomePage from "./pages/HomePage";
import MarketSummary from "./pages/MarketSummary";
import CompaniesPage from "./pages/CompaniesPage";
import StockInformation from "./components/StockInformation";
import FinancialesTable from "./components/StockPage/utils/FinancialsTable";
import axios from "axios";
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
          <Route path="/companies/:sector" element={<CompaniesPage />} />

          {/* <Route path="/companies/symbol/:symbol" element={<StockPage />} />
          <Route
            path="/companies/symbol/:symbol/information"
            element={<StockInformation />}
          />
          <Route
            path="/companies/symbol/:symbol/financials"
            element={<FinancialesTable />}
          /> */}

          <Route path="/companies/:sector/:symbol" element={<StockPage />}>
            <Route path="information" element={<StockInformation />} />
            <Route path="financials" element={<FinancialesTable />} />
          </Route>

          <Route path="/market-summary" element={<MarketSummary />} />
        </Routes>
      </motion.div>
      <CustomSidebar {...{ sideBar, setSideBar }} />
      <CusotmModal {...{ modal, setModal }} />
    </Container>
  );
}

export default App;
