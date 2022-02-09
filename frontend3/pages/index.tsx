import {  useState } from "react";
import { useWeb3React } from "@web3-react/core";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import TokenBalance from "../components/TokenBalance";
import useEagerConnect from "../hooks/useEagerConnect";
import Layout from "../components/Layout";
import ChartGrid from "../components/ChartGrid";
import Radio from "../components/Radio";
import Stats from "../components/Stats";
import Blob from "../components/Blob";

import Coinbase from "../public/coinbase.svg";
import GRID from "../public/grid.png";
const DAI_TOKEN_ADDRESS = "";
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
export default function Home() {
  const [maxCharts, setMaxCharts] = useState(12);
  const [option, setOption] = useState(listOptions[0]);
  const [exchange, setExchange] = useState("coinbase");
  const [market, setMarket] = useState("usd_markets");
  const [sortAscending, setSortAscending] = useState(false);
  const [ping, setPing] = useState(false);

  const { account, library } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  return (
    <div >
       <Head>
        <title>Gridly</title>
        <meta name="description" content="gridly.xyz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      

      <main>
      {isConnected && (
          <section>
            <ETHBalance />

            <TokenBalance tokenAddress={DAI_TOKEN_ADDRESS} symbol="DAI" />
          </section>
          )}
      <div className="  border-b-2 border-yellow-600 mb-8 items-center grid md:grid-cols-3 md:gap-3 lg:gap-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 ">
          <div className="mx-auto ">
            <div className="grid grid-row-3">
              <Image className="" src={GRID} alt="GRID" />
              <div className="mx-auto text-white mb-5">Account stuff</div>
             <button
                    className=" mb-2 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-black py-2 px-4 border border-red-500 hover:border-transparent rounded "
                    >
                    <span className="sr-only">Account Settings</span>
                    Connect Wallet
              </button>
              </div>
          </div>
          
       
          
        <div className="grid grid-flow-row  ">
          <Stats
            exchange={exchange}
            maxCharts={maxCharts}
            sortOrder={sortAscending}
          />
          <div className="text-center mb-2">
            <button
              className="w-[100px] mt-3 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-black py-1 px-2 border border-red-500 hover:border-transparent rounded  "
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

        <div className="mb-12">
          <Radio value={option} setValue={setOption} listValues={listOptions} />
        </div>
      </div>

      <ChartGrid
        exchange={exchange}
        market={option.market}
        maxCharts={maxCharts}
      />
        <Account triedToEagerConnect={triedToEagerConnect} />

       
      </main>

    </div>
  );
}
Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


