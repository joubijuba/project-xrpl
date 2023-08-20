import { useEffect, useState } from "react";
import classes from "./ConnectButton.module.css";
import { Xumm } from "xumm";

const xumm = new Xumm("245f4a62-1328-4c2f-a404-b96e2616b83d"); // Some API Key


function ConnectButton() {
  const handleWallet = () => {
    // Implement the functionality you want when the button is clicked.
    console.log("Connect button clicked!");
  };
  const [account, setAccount] = useState("");
  const [payloadUuid, setPayloadUuid] = useState("");
  const [lastPayloadUpdate, setLastPayloadUpdate] = useState("");
  const [openPayloadUrl, setOpenPayloadUrl] = useState("");
  const [appName, setAppName] = useState("");

  xumm.user.account.then((a) => setAccount(a ?? ""));
  xumm.environment.jwt?.then((j) => setAppName(j?.app_name ?? ""));

  const logout = () => {
    xumm.logout();
    setAccount("");
  };

  const authorize = () => {
    xumm.authorize();
  };

  return (
    <div>
      <button className={classes["connect-wallet"]} onClick={xumm.authorize}>connexion</button>
    </div>
  );
}

export default ConnectButton;
