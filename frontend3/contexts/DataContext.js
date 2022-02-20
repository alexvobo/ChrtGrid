import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";

// Create two context:
// DataContext: to query the context state
// DataDispatchContext: to mutate the context state
const DataContext = createContext();
const DataUpdatecontext = createContext();

function useData() {
  return useContext(DataContext);
}
function useDataUpdate() {
  return useContext(DataUpdatecontext);
}
// A "provider" is used to encapsulate only the
// components that needs the state in this context
function DataProvider({ children }) {
  const [exchange, setExchange] = useState("coinbase");
  const [market, setMarket] = useState("stats");
  const [coins, setCoins] = useState([]);

  const { data: stats } = useSWR(`/api/${exchange}/stats`, (url) =>
    fetch(url).then((r) => r.json())
  );

  const fetchCoins = async () => {
    const data = await fetch(`/api/${exchange}/${market}/coins`).then((res) =>
      res.json()
    );
    setCoins(data);
  };

  function switchExchange(exchangeName) {
    setExchange(exchangeName);
    fetchCoins();
  }
  function switchMarket(marketName) {
    setMarket(marketName);
    fetchCoins();
  }

  useEffect(() => {
    if (exchange !== "" && market !== "") {
      fetchCoins();
    }
  }, [exchange, market]);

  return (
    <DataContext.Provider value={{ exchange, market, coins, stats }}>
      <DataUpdatecontext.Provider value={{ switchExchange, switchMarket }}>
        {children}
      </DataUpdatecontext.Provider>
    </DataContext.Provider>
  );
}

export { DataProvider, useData, useDataUpdate };
