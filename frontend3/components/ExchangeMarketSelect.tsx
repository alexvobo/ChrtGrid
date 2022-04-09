import { useState } from "react";
import { Tab } from "@headlessui/react";
import Image from "next/image";

import { titleCase } from "../util";
import LoadingIcons from "react-loading-icons";
import Pro from "./Pro";
import CustomList from "./CustomList";
import IntervalSelect from "./IntervalSelect";

import { useData, useDataUpdate } from "../contexts/DataContext";
import { useAccount } from "../contexts/AccountContext";

import { ClipboardCopyIcon, RefreshIcon } from "@heroicons/react/outline";
import { CogIcon } from "@heroicons/react/solid";

import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  function refreshPage() {
    window.location.reload();
  }
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
          description: "Volatile Movers",
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
          description: "Recent Listings",
          premium: false,
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
    <div
      className={classNames(
        loading ? "hover:cursor-wait" : null,
        "mx-auto w-full max-w-md pr-6 sm:pr-0 py-4 "
      )}>
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
        <Tab.List
          className={classNames(
            loading ? "hover:cursor-wait" : null,
            "flex p-2 bg-blue-900/20 rounded-xl "
          )}>
          {Object.keys(exchanges).map((e) => (
            <Tab
              disabled={loading}
              key={e}
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-md leading-5 font-medium rounded-lg",
                  selected
                    ? ` ${exchangeInfo[e]["exchangeStyle"]} shadow`
                    : "text-blue-100 hover:bg-indigo-800/20 hover:text-white"
                )
              }>
              {titleCase(e)}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.entries(exchanges).map(([e, markets], idx) => (
            <Tab.Panel key={idx} className={classNames(" rounded-xl p-2")}>
              <ul key={"tabpanel" + idx}>
                {markets?.map((m, i) => (
                  <div className="flex ">
                    <li
                      key={m?.name + i}
                      className={classNames(
                        loading ? "hover:cursor-wait" : null,
                        `${exchangeInfo[e]["marketStyle"]} w-full relative p-3 rounded-md hover:bg-coolGray-100 `,
                        m?.market === market
                          ? "bg-indigo-800/50"
                          : "hover:bg-indigo-800/20"
                      )}>
                      {/* If the user is not logged in */}
                      {!userData || userData === undefined ? (
                        <button
                          disabled={loading || m?.premium}
                          onClick={(e) => {
                            e.preventDefault();
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
                          <ul
                            key={m?.name + String(i)}
                            className="flex mt-1 space-x-1 text-sm font-normal leading-4 text-coolGray-500">
                            <li>{m?.description}</li>
                            <li>&middot;</li>
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
                              loading ? "hover:cursor-wait" : null,
                              m?.premium ? "cursor-not-allowed" : null,
                              "absolute inset-0 rounded-md",
                              "focus:z-10 focus:outline-none focus:ring-2 ring-pink-500"
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

                          <ul
                            key={m?.name + String(i)}
                            className="flex mt-1 space-x-1 text-sm font-normal leading-4 text-coolGray-500">
                            <li key={"desc1" + m?.name + String(i)}>
                              {m?.description}
                            </li>
                            <li key={"desc2" + m?.name + String(i)}>
                              &middot;
                            </li>{" "}
                            {m?.premium && userData?.membership === FREE ? (
                              <li
                                key={"url" + m?.name + String(i)}
                                className="text-red-500  z-10">
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
                              loading ? "hover:cursor-wait" : null,
                              "absolute inset-0 rounded-md",
                              "focus:z-10 focus:outline-none focus:ring-2 ring-pink-500"
                            )}
                          />
                        </button>
                      )}
                    </li>

                    {m?.market === LATEST ? (
                      <button
                        className="w-20 relative   "
                        onClick={() => copy(JSON.stringify(coins))}>
                        <ClipboardCopyIcon
                          className={`${exchangeInfo[e]["textStyle"]} absolute  inset-0 m-auto  w-10 h-10 hover:text-white hover:animate-pulse`}
                        />
                      </button>
                    ) : m?.market === CUSTOM &&
                      userData !== undefined &&
                      userData?.membership !== FREE ? (
                      <button
                        className="w-20 relative "
                        onClick={() => setCustomListOpen(!customListOpen)}>
                        <CogIcon
                          className={`${exchangeInfo[e]["textStyle"]} absolute  inset-0 m-auto  w-10 h-10 hover:text-white hover:animate-pulse`}
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
      <div className="mt-4 text-center font-medium text-white mx-auto">
        <div className={loading ? "visible" : "invisible"}>
          Please Wait...{" "}
          <LoadingIcons.Grid stroke="" className="h-5 w-5  inline " />
        </div>
      </div>
      <div>
        <div
          className={classNames(
            "mt-4 relative",
            userData === undefined ? "invisible" : "visible"
          )}>
          <IntervalSelect />
          <a
            onClick={refreshPage}
            data-tip
            data-for="refresh"
            className="hover:cursor-pointer inline-block absolute right-1/4 xl:right-1/3 top-2 ">
            <RefreshIcon className="text-pink-500 hover:text-white absolute h-7 w-7 " />
          </a>
          <ReactTooltip id="refresh" place="right" type="info" effect="float">
            <span>Refresh to change interval</span>
          </ReactTooltip>
        </div>
      </div>

      <Pro isOpen={openPro} setIsOpen={setOpenPro} />
      <CustomList isOpen={customListOpen} setIsOpen={setCustomListOpen} />
    </div>
  );
}
