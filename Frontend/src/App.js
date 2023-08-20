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
        <form onSubmit={registerUser}>
          {" "}
          <br />
          <input type="submit" value="Register" />
        </form>

        <StockPage />
      </motion.div>
      <CustomSidebar {...{ sideBar, setSideBar }} />
      <CusotmModal {...{ modal, setModal }} />
    </Container>
  );
}

export default App;
