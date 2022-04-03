import React, { useState, useEffect } from "react";
import { useChain } from "react-moralis";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useData } from "../contexts/DataContext";
import { useMoralis } from "react-moralis";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import Account from "../components/Account";
import Layout from "../components/Layout";
import ChartGrid from "../components/ChartGrid";
import Stats from "../components/Stats";
import ExchangeMarketSelect from "../components/ExchangeMarketSelect";

const exchangeThemes = {
  coinbase: {
    gridColor: "border-blue-600 ",
  },
  kucoin: {
    gridColor: "border-[#23af91] ",
  },
  binance: {
    gridColor: "border-yellow-500 ",
  },
};
export default function Home() {
  const [loggedIn, setLoggedIn] = useLocalStorage("loggedIn", "");
  const { exchange, networks } = useData();

  const [supported, setSupported] = useState(false);
  const { enableWeb3, isWeb3Enabled, deactivateWeb3, chainId } = useMoralis();
  const { chain } = useChain();

  useEffect(() => {
    // console.log("moralis", chainId);
    // console.log("usechain", chain?.chainId);
    setSupported(false);
    networks?.map((network) => {
      if (network["chainID"] === chain?.chainId) {
        setSupported(true);
      }
    });
  }, [chain, , chainId, networks]);

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (loggedIn === "true") {
        try {
          await enableWeb3();
          // switchExchange(storedExchange);
          // switchMarket(storedMarket);
        } catch (ex) {
          console.log(ex);
        }
      }
    };

    connectWalletOnPageLoad();
  }, []);
  return (
    <div>
      <main>
        <div className=" mt-2 items-center grid md:grid-cols-3 md:gap-3 lg:gap-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 ">
          <div className="mx-auto grid grid-flow-row">
            {loggedIn === "false" || !isWeb3Enabled ? (
              <Image
                className=""
                height={250}
                width={300}
                src="/grid.svg"
                alt="GRID"
              />
            ) : null}

            <div className=" text-center mb-2">
              {!isWeb3Enabled ? (
                <>
                  <button
                    className=" bg-red-700 hover:bg-red-800 text-white  font-semibold py-2 px-4 rounded "
                    disabled={isWeb3Enabled}
                    onClick={async () => {
                      await enableWeb3();
                      setLoggedIn("true");
                    }}>
                    Connect to MetaMask
                  </button>
                </>
              ) : loggedIn === "true" && supported === true ? (
                <Transition
                  show={loggedIn === "true" && supported === true}
                  enter="transform transition duration-[400ms]"
                  enterFrom="opacity-0 rotate-[-120deg] scale-50"
                  enterTo="opacity-100 rotate-0 scale-100"
                  leave="transform duration-200 transition ease-in-out"
                  leaveFrom="opacity-100 rotate-0 scale-100 "
                  leaveTo="opacity-0 rotate-[-120deg] scale-95 ">
                  <div className="mt-8 grid grid-flow-col mb-6 mr-6">
                    {/* <SelectNetwork /> */}
                    <a
                      href="https://youtu.be/8xyUaSY4ZMg?t=26"
                      target="_blank"
                      rel="noreferrer">
                      <button
                        className=" h-11 m rounded-lg  bg-transparent hover:bg-yellow-400 text-yellow-400 font-medium hover:text-black py-1 px-4 border-2 border-red-600 hover:border-transparent "
                        disabled={!isWeb3Enabled}>
                        I&apos;ve had enough
                      </button>
                    </a>
                    <button
                      className=" h-11 m rounded-lg  bg-transparent hover:bg-yellow-400 text-yellow-400 font-medium hover:text-black py-1 px-4 border-2 border-red-600 hover:border-transparent "
                      disabled={!isWeb3Enabled}
                      onClick={async () => {
                        await deactivateWeb3();
                        localStorage.setItem("market", "stats");
                        setLoggedIn("false");
                      }}>
                      Logout
                    </button>
                  </div>
                  <Account />
                </Transition>
              ) : (
                <div className="text-2xl font-bold text-red-700 animate-pulse">
                  Please switch to Avalanche or Ethereum
                </div>
              )}
            </div>
          </div>
          <div className=" z-10 ">
            <Stats />
          </div>
          <div className="mb-2">
            <ExchangeMarketSelect />
          </div>
        </div>

        <div
          className={
            `z-10 border-2 my-2 ` + exchangeThemes[exchange]?.gridColor
          }>
          <ChartGrid />
        </div>
      </main>
    </div>
  );
}
Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
