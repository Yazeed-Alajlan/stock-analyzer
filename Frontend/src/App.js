import { useState } from "react";
import { motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";

import CustomSidebar from "./components/utils/CustomSidebar";
import CusotmModal from "./components/utils/CusotmModal";
import StockPage from "./pages/StockPage";
import { Header } from "./components/utils/Header";
import { Container } from "react-bootstrap";
import HomePage from "./pages/HomePage";
import MarketSummary from "./pages/MarketSummary";
import CompaniesPage from "./pages/CompaniesPage";
import StockInformation from "./components/StockInformation";
import FinancialesTable from "./components/FinancialsTable";
function App() {
  const [sideBar, setSideBar] = useState(false);
  const [modal, setModal] = useState(false);
  const name = "123123";
  const email = "4444444444444";
  async function registerUser(event) {
    event.preventDefault();

    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });
    const data = await response.json();
    console.log("SENT");
  }

  return (
    <Container
      fluid
      className="bg-light"
      style={{ minHeight: "100vh", width: "100%" }}
    >
      <motion.div
        animate={{
          scale: sideBar || modal ? 0.8 : 1,
          opacity: sideBar || modal ? 0.5 : 1,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      >
        <Header {...{ sideBar, setSideBar }} />

        <button
          onClick={() => {
            setModal(!modal);
          }}
        >
          OPEN MODAL
        </button>

        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/companies" element={<CompaniesPage />} />

          {/* <Route path="/companies/symbol/:symbol" element={<StockPage />} />
          <Route
            path="/companies/symbol/:symbol/information"
            element={<StockInformation />}
          />
          <Route
            path="/companies/symbol/:symbol/financials"
            element={<FinancialesTable />}
          /> */}

          <Route path="/companies/symbol/:symbol" element={<StockPage />}>
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
