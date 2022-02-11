import useSWR from "swr";
import { useState,useEffect } from "react";
import { useWeb3React } from "@web3-react/core";


import Head from "next/head";
import Image from "next/image";

import useEagerConnect from "../hooks/useEagerConnect";
import Account from "../components/Account";
import Layout from "../components/Layout";
import ChartGrid from "../components/ChartGrid";
import Radio from "../components/Radio";
import Stats from "../components/Stats";
import ExchangeSelect from "../components/ExchangeSelect";

import Coinbase from "../public/coinbase.svg";
import GRID from "../public/grid.svg";

const listOptions = [
  {
    name: "Top Gainers",
    market: "stats",
    description: "Pumps pls",
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
              className="mr-4"
              height={20}
              width={20}
              alt="CoinbaseLogo"
            />
            
            <span className="ml-2">{"   "}Coinbase</span>
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
        <a href="https://sandwich.finance" target="_blank" rel="noreferrer">
          🥪.finance
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
           <span className="ml-2">{"   "}Coinbase</span>
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
      <div className="  border-b-2 border-yellow-600  items-center grid md:grid-cols-3 md:gap-3 lg:gap-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 ">
          <div className="mx-auto ">
            <Image className="" height={250} width={300} src={GRID} alt="GRID" />
            
              {/* <div className="mx-auto text-white mb-5">
                {isConnected && (
                  <)}
              </div> */}
              <Account triedToEagerConnect={triedToEagerConnect} />
              
          </div>
          
       
          
        <div className=" z-10">
          <Stats
            exchange={exchange}
            maxCharts={maxCharts}
          />
        </div>

          <div className="mb-12">
            <ExchangeSelect/>
          <Radio value={option} setValue={setOption} listValues={listOptions} />
        </div>
      </div>
      <div className=" z-10">
        <ChartGrid
        exchange={exchange}
        market={option.market}
        maxCharts={maxCharts}
          />
        </div>
       

       
      </main>

    </div>
  );
}
Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


