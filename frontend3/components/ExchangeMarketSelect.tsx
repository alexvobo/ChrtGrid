import { useState } from "react";
import { Tab } from "@headlessui/react";
import Image from "next/image";

import { titleCase } from "../util";
import LoadingIcons from "react-loading-icons";
import Pro from "./Pro";
import CustomList from "./CustomList";

import { useData, useDataUpdate } from "../contexts/DataContext";
import { useAccount } from "../contexts/AccountContext";

import { ClipboardCopyIcon } from "@heroicons/react/outline";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CogIcon } from "@heroicons/react/solid";

const FREE = "free";
const LATEST = "latest";
const CUSTOM = "custom";
const STATS = "stats";
const RANDOM = "random";

// Allows a user to change exchanges and markets.
export default function ExchangeMarketSelect() {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const exchangeInfo = {
    coinbase: {
      name: "Coinbase",
      logo: "/coinbase.svg",
      exchangeStyle: "bg-blue-700 text-white",
      textStyle: "text-blue-700",
      marketStyle: "border-2 border-blue-700 text-white",
      url: "https://www.coinbase.com/price",
      twitter: "https://twitter.com/CoinbaseAssets",
    },
    kucoin: {
      name: "Kucoin",
      logo: "/kucoin.svg",
      exchangeStyle: "bg-[#23af91] text-white",
      textStyle: "text-[#23af91]",
      marketStyle: "border-2 border-[#23af91] text-white",

      url: "https://www.kucoin.com/",
      twitter: "https://twitter.com/Kucoincom",
    },

    binance: {
      name: "Binance",
      logo: "/binance.svg",
      textStyle: "text-yellow-500",
      exchangeStyle: "bg-yellow-500 text-black",
      marketStyle: "border-2 border-yellow-500 text-white",
      url: "https://www.binance.com/",
      twitter: "https://twitter.com/Binance",
    },
  };
  const cooldown = 15000; //Required to prevent spamming of requests, tradingview will ban user
  function copy(addr: string) {
    navigator.clipboard.writeText(addr);
    toast.dark("Copied to clipboard!", {
      position: "bottom-right",
    });
  }
  function listOptions(exchInfo: any) {
    if (exchInfo) {
      return [
        {
          name: "Best/Worst Gainers",
          market: STATS,
          description: "What's moving?",
          premium: false,
          url: (
            <>
              <a href={exchInfo.url} target="_blank" rel="noreferrer">
                <span className="flex ">
                  <Image
                    src={exchInfo.logo}
                    className="mr-4"
                    height={20}
                    width={20}
                    alt={`${exchInfo.name}Logo`}
                  />

                  <span className="ml-2">{exchInfo.name}</span>
                </span>
              </a>
            </>
          ),
        },

        {
          name: "Random",
          market: RANDOM,
          description: "Random Picks",
          premium: false,
          url: (
            <>
              {" "}
              <a href={exchInfo.url} target="_blank" rel="noreferrer">
                <span className="flex ">
                  <Image
                    src={exchInfo.logo}
                    className="mr-2"
                    height={20}
                    width={20}
                    alt={`${exchInfo.name}Logo`}
                  />
                  <span className="ml-2">
                    {"   "}
                    {exchInfo.name}
                  </span>
                </span>
              </a>
            </>
          ),
        },
        {
          name: "Latest",
          market: LATEST,
          description: "Most Recent Listings",
          premium: true,
          url: (
            <>
              <a href={exchInfo.twitter} target="_blank" rel="noreferrer">
                @{exchInfo["twitter"].split("/")[3]}
              </a>
            </>
          ),
        },

        {
          name: "Custom Lists",
          market: CUSTOM,
          description: "Create Your Own",
          premium: true,
          url: (
            <>
              <p>Custom Charts</p>
            </>
          ),
        },
      ];
    }
  }
  let [exchanges] = useState({
    coinbase: listOptions(exchangeInfo["coinbase"]),
    kucoin: listOptions(exchangeInfo["kucoin"]),
    binance: listOptions(exchangeInfo["binance"]),
  });
  const { exchange, market, coins } = useData();
  const { userData } = useAccount();
  const { switchExchange, switchMarket } = useDataUpdate();
  const [openPro, setOpenPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customListOpen, setCustomListOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group
        defaultIndex={Object.keys(exchanges).indexOf(exchange)}
        onChange={(index) => {
          // console.log(exchange, market);
          setLoading(true);
          switchExchange(Object.keys(exchanges)[index]);
          setTimeout(() => {
            setLoading(false);
          }, cooldown);
        }}>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl ">
          {Object.keys(exchanges).map((e) => (
            <Tab
              disabled={loading}
              key={e}
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-md leading-5 font-medium rounded-lg",
                  selected
                    ? ` ${exchangeInfo[e]["exchangeStyle"]} shadow`
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }>
              {titleCase(e)}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.entries(exchanges).map(([e, markets], idx) => (
            <Tab.Panel key={idx} className={classNames(" rounded-xl p-2")}>
              <ul>
                {markets?.map((m, i) => (
                  <div className="flex ">
                    <li
                      key={m.name + i}
                      className={classNames(
                        `${exchangeInfo[e]["marketStyle"]} w-full relative p-3 rounded-md hover:bg-coolGray-100 `,
                        m?.market === market
                          ? "bg-indigo-700/50"
                          : "hover:bg-indigo-800/40"
                      )}>
                      {/* If the user is not logged in */}
                      {!userData || userData === undefined ? (
                        <button
                          disabled={loading || m?.premium}
                          onClick={() => {
                            // if not logged in and it's loading or it's a premium option, do nothing, else switch market
                            setLoading(true);
                            switchMarket(m?.market);
                            setTimeout(() => {
                              setLoading(false);
                            }, cooldown);
                          }}>
                          <h3 className="text-yellow-500 mb-2 text-md text-left font-medium leading-5">
                            {m?.name}
                          </h3>
                          <ul className="flex mt-1 space-x-1 text-sm font-normal leading-4 text-coolGray-500">
                            <li>{m?.description} &nbsp; </li>
                            <li>&middot;</li>{" "}
                            {!m?.premium ? (
                              <li className="text-blue-500 hover:underline z-10">
                                {m?.url}
                              </li>
                            ) : (
                              <li className="text-red-500  z-10">
                                Please connect your wallet
                              </li>
                            )}
                          </ul>

                          <a
                            href="#"
                            className={classNames(
                              m?.premium ? "cursor-not-allowed" : null,
                              "absolute inset-0 rounded-md",
                              "focus:z-10 focus:outline-none focus:ring-1 ring-red-600"
                            )}
                          />
                        </button>
                      ) : (
                        <button
                          disabled={loading}
                          onClick={() => {
                            // If the user is logged in and it's loading, disable option.
                            // If the user is logged in and it's premium and user doesnt have premium, load modal, else switch market
                            if (m?.premium && userData?.membership === FREE) {
                              setOpenPro(true);
                            } else {
                              setLoading(true);
                              switchMarket(m?.market);
                              setTimeout(() => {
                                setLoading(false);
                              }, cooldown);
                            }
                          }}>
                          <h3 className="text-yellow-500 mb-2 text-md text-left font-medium leading-5">
                            {m?.name}
                          </h3>

                          <ul className="flex mt-1 space-x-1 text-sm font-normal leading-4 text-coolGray-500">
                            <li>{m?.description}</li>
                            <li>&middot;</li>
                            {m?.premium && userData?.membership === FREE ? (
                              <li className="text-red-500  z-10">
                                Click to purchase premium
                              </li>
                            ) : (
                              <li className="text-blue-500 hover:underline z-10">
                                {m?.url}
                              </li>
                            )}
                          </ul>

                          <a
                            href="#"
                            className={classNames(
                              "absolute inset-0 rounded-md",
                              "focus:z-10 focus:outline-none focus:ring-1 ring-red-600"
                            )}
                          />
                        </button>
                      )}
                    </li>

                    {m?.market === LATEST &&
                    userData !== undefined &&
                    userData?.membership !== FREE ? (
                      <button
                        className="w-20 relative   "
                        onClick={() => copy(JSON.stringify(coins))}>
                        <ClipboardCopyIcon
                          className={`${exchangeInfo[e]["textStyle"]} absolute  inset-0 m-auto  w-10 h-10 hover:animate-pulse`}
                        />
                        <a
                          href="#"
                          className={classNames(
                            "absolute inset-0 rounded-md",
                            "focus:z-10 focus:outline-none focus:ring-1 ring-red-600"
                          )}
                        />
                      </button>
                    ) : m?.market === CUSTOM &&
                      userData !== undefined &&
                      userData?.membership !== FREE ? (
                      <button
                        className="w-20 relative "
                        onClick={() => setCustomListOpen(!customListOpen)}>
                        <CogIcon
                          className={`${exchangeInfo[e]["textStyle"]} absolute  inset-0 m-auto  w-10 h-10 hover:animate-pulse`}
                        />
                        <a
                          href="#"
                          className={classNames(
                            "absolute inset-0 rounded-md",
                            "focus:z-10 focus:outline-none focus:ring-1 ring-red-600"
                          )}
                        />
                      </button>
                    ) : null}
                  </div>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
      <Pro isOpen={openPro} setIsOpen={setOpenPro} />
      <CustomList isOpen={customListOpen} setIsOpen={setCustomListOpen} />
      <div className="text-center font-medium text-white mx-auto">
        {loading ? (
          <div>
            Please Wait...{" "}
            <LoadingIcons.Grid stroke="" className="h-5 w-5 mb-2 inline " />{" "}
          </div>
        ) : null}
      </div>
    </div>
  );
}
