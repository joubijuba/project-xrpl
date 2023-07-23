import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from "@chakra-ui/react";
import './index.css';
import App from './App';
import { GemWalletProvider } from './shared/contexts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <GemWalletProvider>
        <App />
      </GemWalletProvider>
    </ChakraProvider>
  </React.StrictMode>
);