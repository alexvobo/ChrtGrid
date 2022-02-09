import { useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import LoadingIcons from "react-loading-icons";

import Layout from "../components/layout";
import ChartGrid from "../components/chartGrid";
import Radio from "../components/radio";
import Stats from "../components/stats";
import Blob from "../components/blob";

import Coinbase from "../public/coinbase.svg";
import GRID from "../public/grid.png";
const listOptions = [
  {
    name: "Top Gainers",
    market: "topgainers",
    description: "Pumps pls",
    url: (
      <>
        {" "}
        <a
          href="https://www.coinbase.com/price"
          target="_blank"
          rel="noreferrer">
          <span className="flex">
            <Image
              src={Coinbase}
              className="mr-2"
              height={20}
              width={20}
              alt="CoinbaseLogo"
            />
            {"   "}
            Coinbase
          </span>
        </a>
      </>
    ),
  },

  {
    name: "Latest",
    market: "latest",
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
  },

  {
    name: "Random",
    market: "random",
    description: "🎲🎰 Roll the dice 🎰🎲",
    url: (
      <>
        {" "}
        <a href="https://sandwich.finance" target="_blank" rel="noreferrer">
          🥪 .finance
        </a>
      </>
    ),
  },
  {
    name: "Default",
    market: "custom",
    description: `List as-is`,
    url: (
      <>
        {" "}
        <a
          href="https://www.coinbase.com/price"
          target="_blank"
          rel="noreferrer">
          <span className="flex ">
            <Image
              src={Coinbase}
              className="mr-2"
              height={20}
              width={20}
              alt="CoinbaseLogo"
            />
            {"   "}
            Coinbase
          </span>
        </a>
      </>
    ),
  },
];

function reloadPage() {
  window.location.reload(false);
}

export default function Home() {
  const [maxCharts, setMaxCharts] = useState(12);
  const [option, setOption] = useState(listOptions[0]);
  const [exchange, setExchange] = useState("coinbase");
  const [market, setMarket] = useState("usd_markets");
  const [sortAscending, setSortAscending] = useState(false);
  const [ping, setPing] = useState(false);

  // useInterval(() => {
  //   // Every 15 min, reload page to refresh all TradingView charts at once
  //   reloadPage();
  // }, 1000 * 60 * 10);

  return (
    <div className="">
      <Head>
        <title>Gridly</title>
        <meta name="description" content="gridly.xyz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" items-center grid md:grid-cols-3 md:gap-3 lg:gap-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 ">
        <span className="mx-auto ">
          <Image className="h-40 w-40" src={GRID} alt="GRID" />
        </span>

        <div className="grid grid-flow-row  ">
          <Stats
            exchange={exchange}
            maxCharts={maxCharts}
            sortOrder={sortAscending}
          />
          <div className="text-center mb-2">
            <button
              className="w-[100px] bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-black py-1 px-2 border border-red-500 hover:border-transparent rounded  "
              onClick={() => {
                setSortAscending(!sortAscending);
              }}>
              Sort
            </button>
          </div>
          <span className="flex mx-auto text-center justify-center text-white ">
            {ping ? <Blob color="green" /> : <Blob color="red" />}
          </span>
        </div>

        <div className="">
          <Radio value={option} setValue={setOption} listValues={listOptions} />
        </div>
      </div>

      <ChartGrid
        exchange={exchange}
        market={option.market}
        maxCharts={maxCharts}
      />
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
