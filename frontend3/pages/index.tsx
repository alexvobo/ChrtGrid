import React, { useState, useEffect } from "react";
import { useChain } from "react-moralis";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useData } from "../contexts/DataContext";
import { useMoralis } from "react-moralis";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import { ChevronDoubleUpIcon } from "@heroicons/react/solid";
import Account from "../components/Account";
import Layout from "../components/Layout";
import ChartGrid from "../components/ChartGrid";
import Stats from "../components/Stats";
import ExchangeMarketSelect from "../components/ExchangeMarketSelect";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
  const [wide, setWide] = useState(false);

  const { enableWeb3, isWeb3Enabled, chainId } = useMoralis();
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
    if (supported && loggedIn === "true") {
      setWide(true);
    } else {
      setWide(false);
    }
  }, [supported, loggedIn]);

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
      <main className="border-t-2 border-yellow-600 overflow-hidden">
        {/* Only show account window when we are logged in and connected to a supported network */}
        {loggedIn === "true" && supported && (
          <Transition
            show={loggedIn === "true" && supported}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0 rotate-[-120deg] scale-50"
            enterTo="opacity-100 rotate-0 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 rotate-0 scale-100 "
            leaveTo="opacity-0  scale-95 ">
            <Account />
          </Transition>
        )}

        <div className=" mt-8 items-center grid md:grid-cols-3 md:gap-3 lg:gap-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 ">
          {!isWeb3Enabled || loggedIn === "false" || !supported ? (
            <div className="mx-auto grid grid-flow-row ">
              <Image
                className=""
                height={250}
                width={300}
                src="/grid.svg"
                priority={true}
                alt="GRID"
              />
              {!isWeb3Enabled || loggedIn === "false" ? (
                <div className=" text-center mb-2">
                  <button
                    className=" bg-red-700 hover:bg-red-800 text-white  font-semibold py-2 px-4 rounded "
                    disabled={isWeb3Enabled}
                    onClick={async () => {
                      await enableWeb3();
                      setLoggedIn("true");
                    }}>
                    Connect to MetaMask
                  </button>
                  <div className="relative mt-2">
                    <ChevronDoubleUpIcon className="absolute  m-auto left-0 right-0 text-white  animate-pulse h-4 w-4 " />
                  </div>
                  <span className="mt-4 inline-block text-xs text-white/50">
                    psst! more features are available 😎
                  </span>
                </div>
              ) : null}
              {!supported && isWeb3Enabled ? (
                <div className="text-xl font-bold text-red-700 animate-pulse">
                  Please switch to Ethereum or Avalanche
                </div>
              ) : null}
            </div>
          ) : null}

          <div
            className={classNames(
              "z-10 ",
              loggedIn === "true" && supported ? "col-span-2" : null
            )}>
            <Stats wide={wide} />
          </div>
          <div className="mb-8 ml-6">
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
// loggedIn === "true" && supported === true ? (
//   <Transition
//     show={loggedIn === "true" && supported === true}
//     enter="transform transition duration-[400ms]"
//     enterFrom="opacity-0 rotate-[-120deg] scale-50"
//     enterTo="opacity-100 rotate-0 scale-100"
//     leave="transform duration-200 transition ease-in-out"
//     leaveFrom="opacity-100 rotate-0 scale-100 "
//     leaveTo="opacity-0 rotate-[-120deg] scale-95 ">
//     <Account />
//   </Transition>
Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
