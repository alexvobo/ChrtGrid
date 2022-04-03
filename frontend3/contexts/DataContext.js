import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import Image from "next/image";
import { useAccount } from "./AccountContext";
// Fetches coins & stats from the database. Handles switching exchanges & markets in the <ExchangeMarketSelect> component.

const DataContext = createContext();
const DataUpdatecontext = createContext();

export function useData() {
  return useContext(DataContext);
}
export function useDataUpdate() {
  return useContext(DataUpdatecontext);
}

export function DataProvider({ children }) {
  const networks = [
    // {
    //   name: "Avalanche Testnet",
    //   currencyName: "AVAX",
    //   chainID: "0xa869",
    //   unavailable: false,
    //   currencyLogo: (
    //     <Image className="" src="/avax.svg" height={20} width={20} alt="AVAX" />
    //   ),
    // },
    {
      name: "Avalanche",
      currencyName: "AVAX",
      chainID: "0xa86a",
      unavailable: false,
      currencyLogo: (
        <Image className="" src="/avax.svg" height={20} width={20} alt="AVAX" />
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
  const defaultExchange = "kucoin";
  const defaultMarket = "stats";
  const [exchange, setExchange] = useState("");
  const [market, setMarket] = useState("");
  const [coins, setCoins] = useState([]);
  const { customListDB } = useAccount();

  const { data: stats } = useSWR(`/api/${exchange}/stats`, (url) =>
    fetch(url).then((r) => r.json())
  );

  const fetchCoins = async () => {
    if (market !== "custom") {
      const data = await fetch(`/api/${exchange}/${market}/coins`).then((res) =>
        res.json()
      );
      setCoins(data);
    }
  };

  function switchExchange(exchangeName) {
    setExchange(exchangeName);
  }
  function switchMarket(marketName) {
    setMarket(marketName);
    if (marketName === "custom") {
      let coinList = [];
      customListDB?.map((item) => {
        coinList.push(`${item?.exchange}:${item?.symbol}${item?.pair}`);
      });
      console.log(coinList);
      setCoins(coinList);
    } else {
      fetchCoins();
    }
  }
  useEffect(() => {
    const exchangeInStorage = localStorage.getItem("exchange");
    if (exchangeInStorage) {
      setExchange(exchangeInStorage);
    } else {
      setExchange(defaultExchange);
    }
    const marketInStorage = localStorage.getItem("market");
    if (marketInStorage) {
      setMarket(marketInStorage);
    } else {
      setMarket(defaultMarket);
    }
  }, []);

  useEffect(() => {
    if (exchange !== "" && market !== "" && market !== "custom") {
      localStorage.setItem("exchange", exchange);
      localStorage.setItem("market", market);
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
