import React, { createContext, useState, useContext } from "react";

const AccountContext = createContext();
const AccountUpdateContext = createContext();

function useAccount() {
  return useContext(AccountContext);
}
function useAccountUpdate() {
  return useContext(AccountUpdateContext);
}

function AccountProvider({ children }) {
  //api stuff
  //use effects
  //swr
  //   fetch("/api/user/" + account)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setUserData(data);
  //       console.log(data);
  //     })
  //     .catch((err) => {});
  return (
    <AccountContext.Provider>
      <AccountUpdateContext.Provider>{children}</AccountUpdateContext.Provider>
    </AccountContext.Provider>
  );
}

export { AccountProvider, useAccount, useAccountUpdate };
