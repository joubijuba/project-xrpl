import React, { useState, useEffect, useCallback } from "react";

function Invest() {
  const [isOwner, setIsOwner] = useState();

  const checkOwnerAddress = async () => {

  };

  useEffect(() => {
    checkOwnerAddress();
  }, [checkOwnerAddress]);

  return <React.Fragment>Investing page</React.Fragment>;
}

export default Invest;