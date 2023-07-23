import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import classes from "./Navigation.module.css";
import ConnectButton from "./ConnectButton";

function Navigation() {
  const [isOwner, setIsOwner] = useState(false);

  const checkOwnerAddress = async () => {};

  const handleWallet = () => {
    // Implement the functionality you want when the button is clicked.
    console.log("Connect button clicked!");
  };

  useEffect(() => {
    checkOwnerAddress();
  }, [checkOwnerAddress]);

  return (
    <header className={classes.header}>
      {!isOwner && (
        <ul>
          <li>
            <NavLink to="/users">Home</NavLink>
          </li>
          <li>
            <NavLink to="/users/newApplication">
              Crowdfunding application
            </NavLink>
          </li>
          <li>
            <NavLink to="/users/invest">Invest</NavLink>
          </li>
          <li>
            <NavLink to="/users/myPortfolio">My portfolio</NavLink>
          </li>
          <ConnectButton/>
        </ul>
      )}
      {isOwner && (
        <>
          <ul>
            <li>
              <NavLink to="/adminDashboard">Admin dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/adminDashboard/mintFleetAssets">
                Mint new assets
              </NavLink>
            </li>
            <ConnectButton/>
          </ul>
        </>
      )}
    </header>
  );
}

export default Navigation;