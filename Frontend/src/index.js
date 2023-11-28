import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { StocksDataProvider } from "contexts/StocksDataContext";
import "style/main.scss";
import { ModalProvider } from "contexts/ModalContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StocksDataProvider>
      <ModalProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ModalProvider>
    </StocksDataProvider>
  </React.StrictMode>
);
// document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
