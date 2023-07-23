import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import classes from "./Navigation.module.css";

function Navigation() {
  const [isOwner, setIsOwner] = useState();

  const checkOwnerAddress = async () => {};

  useEffect(() => {
    checkOwnerAddress();
  }, [checkOwnerAddress]);

  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink activeClassName={classes.active} to="/voters">
              Users
            </NavLink>
          </li>
          {isOwner && (
            <li>
              <NavLink activeClassName={classes.active} to="/admin">
                Admin
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;