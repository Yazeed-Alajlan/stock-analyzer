import { useState } from "react";
import { motion } from "framer-motion";

import MainPage from "./pages/MainPage";
import CustomSidebar from "./components/utils/CustomSidebar";
import CusotmModal from "./components/utils/CusotmModal";
import StockPage from "./pages/StockPage";
import { Header } from "./components/utils/Header";
import { Container } from "react-bootstrap";
function App() {
  const [sideBar, setSideBar] = useState(false);
  const [modal, setModal] = useState(false);

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

        <StockPage />
      </motion.div>
      <CustomSidebar {...{ sideBar, setSideBar }} />
      <CusotmModal {...{ modal, setModal }} />
    </Container>
  );
}

export default App;
