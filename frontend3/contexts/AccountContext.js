import React, { createContext, useState, useContext, useEffect } from "react";
import { useMoralis } from "react-moralis";
import useSWR from "swr";

//Fetches userData and memberships available, and sets maxCharts based on what is set in the database for that membership tier.

const AccountContext = createContext();
function useAccount() {
  return useContext(AccountContext);
}
function AccountProvider({ children }) {
  const { account } = useMoralis();
  // const [maxCharts, setMaxCharts] = useState(8);
  const [customListDB, setCustomListDB] = useState(null);

  // const { data: memberships } = useSWR("/api/memberships/", (url) =>
  //   fetch(url).then((r) => r.json())
  // );
  const { data: userData, mutate: mutateUser } = useSWR(
    account ? "/api/user/" + account : null,
    (url) => fetch(url).then((r) => r.json())
  );

  // function getMaxCharts(userData) {
  //   if (userData && userData !== undefined) {
  //     // console.log(userData);
  //     let maxCharts = memberships?.memberships?.filter(
  //       (m) => m?.tier === userData?.membership
  //     );
  //     if (maxCharts != null && Object.keys(maxCharts)?.length) {
  //       // console.log("MAX CHARTS:", maxCharts);
  //       setMaxCharts(maxCharts[0]["maxCharts"]);
  //     }
  //   }
  // }
  function getCustomList(userData) {
    if (userData && userData !== undefined) {
      if (userData.customList?.length) {
        // console.log(userData.customList);
        setCustomListDB(userData.customList);
      } else {
        console.log("No list found");
      }
    }
  }
  useEffect(() => {
    // getMaxCharts(userData);
    getCustomList(userData);
    return () => {
      // setMaxCharts(9);
      setCustomListDB([]);
    };
  }, [userData]);

  return (
    <AccountContext.Provider value={{ userData, customListDB, mutateUser }}>
      {children}
    </AccountContext.Provider>
  );
}

export { AccountProvider, useAccount };
