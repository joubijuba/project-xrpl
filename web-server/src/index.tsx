import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import App from "./App";
import { GemWalletProvider } from "./shared/contexts";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <GemWalletProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GemWalletProvider>
    </ChakraProvider>
  </React.StrictMode>
);
