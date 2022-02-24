import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import avax from "../public/avax.svg";
// Create two context:
// DataContext: to query the context state
// DataDispatchContext: to mutate the context state
const DataContext = createContext();
const DataUpdatecontext = createContext();

export function useData() {
  return useContext(DataContext);
}
export function useDataUpdate() {
  return useContext(DataUpdatecontext);
}
// A "provider" is used to encapsulate only the
// components that needs the state in this context
export function DataProvider({ children }) {
  const networks = [
    // {
    //   name: "Avalanche Testnet",
    //   currencyName: "AVAX",
    //   chainID: "0xa869",
    //   unavailable: false,
    //   currencyLogo: (
    //     <Image className="" src={avax} height={20} width={20} alt="AVAX" />
    //   ),
    // },
    {
      name: "Avalanche",
      currencyName: "AVAX",
      chainID: "0xa86a",
      unavailable: false,
      currencyLogo: (
        <Image className="" src={avax} height={20} width={20} alt="AVAX" />
      ),
    },
    {
      name: "Ethereum",
      currencyName: "ETH",
      chainID: "0x1",
      unavailable: false,
      currencyLogo: <p className="inline">Ξ</p>,
    },
  ];
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
    <DataContext.Provider value={{ exchange, market, coins, stats, networks }}>
      <DataUpdatecontext.Provider value={{ switchExchange, switchMarket }}>
        {children}
      </DataUpdatecontext.Provider>
    </DataContext.Provider>
  );
}

// export { DataProvider, useData, useDataUpdate };
