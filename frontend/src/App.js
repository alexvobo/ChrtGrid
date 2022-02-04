import "./App.css";

import { useEffect, useState } from "react";
import useInterval from "./hooks/useInterval";
import ChartGrid from "./components/ChartGrid";
import Radio from "./components/Radio";
import CustomList from "./components/CustomList";
import Stats from "./components/Stats";
import LoadingIcons from "react-loading-icons";
import Coinbase from "./logos/coinbase.svg";
import Blob from "./components/Blob";
import ConnectWallet from "./components/ConnectWallet";
const listOptions = [
  {
    name: "Top Gainers",
    description: "Pumps pls",
    url: (
      <>
        {" "}
        <a
          href="https://www.coinbase.com/price"
          target="_blank"
          rel="noreferrer">
          <span className="flex">
            <img src={Coinbase} className="h-5 w-5 mr-2" alt="CoinbaseLogo" />
            {"   "}
            Coinbase
          </span>
        </a>
      </>
    ),
    endpoint: `topgainers`,
  },
  {
    name: "Latest",
    description: "New coins",
    url: (
      <>
        {" "}
        <a
          href="https://twitter.com/CoinbaseAssets"
          target="_blank"
          rel="noreferrer">
          {" "}
          @CoinbaseAssets
        </a>
      </>
    ),
    endpoint: `latest`,
  },

  {
    name: "Random",
    description: "🎲🎰 Roll the dice 🎰🎲",
    url: (
      <>
        {" "}
        <a href="https://sandwich.finance" target="_blank" rel="noreferrer">
          🥪 .finance
        </a>
      </>
    ),
    endpoint: `random`,
  },
  {
    name: "Default",
    description: `List as-is`,
    url: (
      <>
        {" "}
        <a
          href="https://www.coinbase.com/price"
          target="_blank"
          rel="noreferrer">
          <span className="flex">
            <img src={Coinbase} className="h-5 w-5 mr-2" alt="CoinbaseLogo" />
            {"   "}
            Coinbase
          </span>
        </a>
      </>
    ),
    endpoint: `custom`,
  },
];

function orderBySubKey(input, key) {
  return Object.keys(input)
    .map((key) => ({ key, value: input[key] }))
    .sort((a, b) => b.value[key] - a.value[key]);
}
function reloadPage() {
  window.location.reload(false);
}
function App() {
  // const [exchangeList, setExchangeList] = useState([]);
  // const [exchangeMarkets, setExchangeMarkets] = useState([]);
  // const [customList, setCustomList] = useState([]);
  const [maxCharts, setMaxCharts] = useState(12);
  const [option, setOption] = useState(listOptions[0]);
  const [exchange, setExchange] = useState("coinbase");
  const [market, setMarket] = useState("usd_markets");
  const [coins, setCoins] = useState([]);
  const [pulse, setPulse] = useState(true);
  const [ping, setPing] = useState(false);
  const [stats, setStats] = useState({});

  const checkWalletIsConnected = () => {};
  const connectWalletHandler = () => {};
  useEffect(() => {
    //  Fetch chart data on initial render
    if (option.endpoint) {
      fetch(`${exchange}/${option.endpoint}`)
        .then((res) => res.json())
        .then((data) => {
          if (data["status"] === 200) {
            if (data["data"].length > maxCharts) {
              setCoins(data["data"].slice(0, maxCharts));
            } else {
              setCoins(data["data"]);
            }
          } else {
            console.log("Data not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching Data:", error);
        });
    }
  }, [option, exchange, market, maxCharts]);
  useEffect(() => {
    // Load stats on initial render
    fetch(`${exchange}/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data["status"] === 200) {
          setStats(
            Object.entries(
              orderBySubKey(data["data"], "percentage_change")
            ).slice(0, 9)
          );
          setPing(true);
        } else {
          console.log("Data not found");
        }
      })
      .catch((error) => {
        setPing(false);
        console.error("Error fetching stats:", error);
      });
  }, [exchange]);

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  useInterval(() => {
    // Every 5 sec, refresh stats
    fetch(`${exchange}/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data["status"] === 200) {
          setStats(
            Object.entries(
              orderBySubKey(data["data"], "percentage_change")
            ).slice(0, 9)
          );
          setPing(true);
          setPulse(!pulse);
        } else {
          setPing(false);
          console.log("Data not found");
        }
      })
      .catch((error) => {
        setPing(false);
        console.error("Error fetching stats:", error);
      });
  }, 5000);
  useInterval(() => {
    // Every 15 min, reload page to refresh all TradingView charts at once
    reloadPage();
  }, 1000 * 60 * 10);
  return (
    <div className="App">
      <div className=" items-center grid md:grid-cols-3 md:gap-3 lg:gap-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 ">
        <span className="mx-auto ">
          <img
            className="h-40 w-40"
            src={require("./logos/GRID.png")}
            alt="GRID"
          />
          <ConnectWallet connectWalletHandler={connectWalletHandler} />
        </span>

        <Stats stats={stats} pulse={pulse} />
        <div className="xs:scale-[.9] ">
          <Radio value={option} setValue={setOption} listValues={listOptions} />
        </div>
      </div>
      <span className="flex mx-auto text-center justify-center ">
        {ping === true ? <Blob color="green" /> : <Blob color="red" />}
      </span>
      {coins.length > 0 ? (
        <ChartGrid data={coins} />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <LoadingIcons.Bars height="5em" fill="white" speed={0.75} />
        </div>
      )}
      <div className="text-center text-white pt-5">
        © 2022 Copyright{" "}
        <a class="text-yellow-500" href="https://tailwind-elements.com/">
          gridly.xyz Foundation
        </a>
      </div>
    </div>
  );
}

export default App;
