import React, { createContext, useState, useContext, useEffect } from "react";
import { useMoralis } from "react-moralis";
import useSWR from "swr";
import useENSName from "../hooks/useENSName";

const AccountContext = createContext();

function useAccount() {
  return useContext(AccountContext);
}

function AccountProvider({ children }) {
  const { account, chainId, isLoggingOut } = useMoralis();
  const ENSName = useENSName(account);
  const [maxCharts, setMaxCharts] = useState(9);
  const [exchangePreference, setExchangePreference] = useState(0); //paywall

  const { data: memberships } = useSWR("/api/memberships/", (url) =>
    fetch(url).then((r) => r.json())
  );
  const { data: userData } = useSWR(
    account ? "/api/user/" + account : null,
    (url) => fetch(url).then((r) => r.json())
  );
  function getMaxCharts(userData) {
    if (userData && userData !== undefined) {
      console.log(userData);
      let maxCharts = memberships.memberships.filter(
        (m) => m.tier === userData.membership
      );
      if (Object.keys(maxCharts).length) {
        console.log("MAX CHARTS:", maxCharts);
        setMaxCharts(maxCharts[0]["maxCharts"]);
      }
    }
  }
  useEffect(() => {
    getMaxCharts(userData);

    return () => {
      setMaxCharts(9);
    };
  }, [userData]);

  // useEffect(() => {
  //   first

  //   return () => {
  //     second
  //   }
  // }, [isLoggingOut])

  return (
    <AccountContext.Provider value={{ userData, maxCharts }}>
      {children}
    </AccountContext.Provider>
  );
}

export { AccountProvider, useAccount };
