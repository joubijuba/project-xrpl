import React, { useState, useEffect, useCallback } from "react";

function Home() {
  const [isOwner, setIsOwner] = useState();

  const checkOwnerAddress = async () => {

  };

  useEffect(() => {
    checkOwnerAddress();
  }, [checkOwnerAddress]);

  return <React.Fragment>Welcome user</React.Fragment>;
}

export default Home;