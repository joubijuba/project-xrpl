import { useEffect, useState } from "react";
import classes from "./ConnectButton.module.css";

function ConnectButton() {

  const handleWallet = () => {
    // Implement the functionality you want when the button is clicked.
    console.log("Connect button clicked!");
  };

  return (
    <button className={classes["connect-wallet"]} onClick={handleWallet}>
      {true ? "Connect Wallet" : "OXKDKEOKDOKS"}
    </button>
  );
}

export default ConnectButton;
