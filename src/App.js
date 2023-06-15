import { useState } from "react";
import { motion } from "framer-motion";

import MainPage from "./pages/MainPage";
import CustomSidebar from "./components/utils/CustomSidebar";
import CusotmModal from "./components/utils/CusotmModal";
function App() {
  const [sideBar, setSideBar] = useState(false);
  const [modal, setModal] = useState(false);

  return (
    <div className="bg-light pt-5" style={{ height: "100vh", width: "100%" }}>
      <div className="container  pt-5">
        <motion.div
          animate={{
            scale: sideBar || modal ? 0.8 : 1,
            opacity: sideBar || modal ? 0.5 : 1,
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        >
          <button
            onClick={() => {
              setModal(!modal);
            }}
          >
            OPEN MODAL
          </button>
          <button
            onClick={() => {
              setSideBar(!sideBar);
            }}
          >
            OPEN
          </button>

          <MainPage />
        </motion.div>
        <CustomSidebar sideBar={sideBar} setSideBar={setSideBar} />
        <CusotmModal {...{ modal, setModal }} />
      </div>
    </div>
  );
}

export default App;
