import React, { useState, useEffect, useCallback } from "react";

function UsersInterface() {
  const [isOwner, setIsOwner] = useState();

  const checkOwnerAddress = async () => {

  };

  useEffect(() => {
    checkOwnerAddress();
  }, [checkOwnerAddress]);

  return <React.Fragment>Welcome admin</React.Fragment>;
}

export default UsersInterface;