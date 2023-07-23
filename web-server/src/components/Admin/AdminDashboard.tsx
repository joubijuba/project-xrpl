import React, { useState, useEffect, useCallback } from "react";
import classes from "../../styles/hero.module.css";

function AdminDashboard() {

  console.log("hahaha")
  
  const [isOwner, setIsOwner] = useState();

  const checkOwnerAddress = async () => {};

  useEffect(() => {
    checkOwnerAddress();
  }, [checkOwnerAddress]);

  return (
    <div className={classes.hero}>
      <h2> YESSS </h2>
    </div>
  );
}

export default AdminDashboard;
