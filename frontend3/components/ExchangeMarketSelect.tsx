import { useState, useContext } from "react";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import CoinbaseLogo from "../public/coinbase.svg";
import KucoinLogo from "../public/kucoin.svg";
import BinanceLogo from "../public/binance.svg";
import { titleCase } from "../util";
import { useLocalStorage } from "../hooks/useLocalStorage";

import { useData, useDataUpdate } from "../contexts/DataContext";

export default function Example() {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const exchangeInfo = {
    coinbase: {
      name: "Coinbase",
      logo: CoinbaseLogo,
      exchangeStyle: "bg-blue-700 text-white",
      marketStyle: "border-2 border-blue-700 text-white",

      url: "https://www.coinbase.com/",
      twitter: "https://twitter.com/CoinbaseAssets",
    },
    kucoin: {
      name: "Kucoin",
      logo: KucoinLogo,
      exchangeStyle: "bg-[#23af91] text-white",
      marketStyle: "border-2 border-[#23af91] text-white",
      url: "https://www.kucoin.com/",
      twitter: "https://twitter.com/kucoincom",
    },

    binance: {
      name: "Binance",
      logo: BinanceLogo,
      exchangeStyle: "bg-yellow-500 text-black",
      marketStyle: "border-2 border-yellow-500 text-white",

      url: "https://www.binance.com/",
      twitter: "https://twitter.com/binance",
    },
  };
  function listOptions(exchInfo) {
    if (exchInfo) {
      return [
        {
          name: "Top/Worst Gainers",
          market: "stats",
          description: "Pumps pls",
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
          name: "Latest",
          market: "latest",
          description: "New coins",
          url: (
            <>
              <a href={exchInfo.twitter} target="_blank" rel="noreferrer">
                @{exchInfo["twitter"].split("/")[3]}
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
              <a
                href="https://sandwich.finance"
                target="_blank"
                rel="noreferrer">
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
                    src={exchInfo.logo}
                    className="mr-2"
                    height={20}
                    width={20}
                    alt="CoinbaseLogo"
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
      ];
    }
  }
  let [exchanges] = useState({
    coinbase: listOptions(exchangeInfo["coinbase"]),
    kucoin: listOptions(exchangeInfo["kucoin"]),
    binance: listOptions(exchangeInfo["binance"]),
  });
  const { exchange, market } = useData();
  const { switchExchange, switchMarket } = useDataUpdate();

  return (
    <div className="mx-auto w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group
        defaultIndex={0}
        onChange={(index) => {
          console.log(exchange, market);
          switchExchange(Object.keys(exchanges)[index]);
        }}>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
          {Object.keys(exchanges).map((e) => (
            <Tab
              key={e}
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-sm leading-5 font-medium rounded-lg",

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
            <Tab.Panel key={idx} className={classNames(" rounded-xl p-3")}>
              <ul>
                {markets.map((m, i) => (
                  <li
                    key={m.name + i}
                    className={classNames(
                      `${exchangeInfo[e]["marketStyle"]} relative p-3 rounded-md hover:bg-coolGray-100`,
                      m.market === market ? "bg-indigo-800/50" : ""
                    )}>
                    <button onClick={() => switchMarket(m.market)}>
                      <h3 className="text-yellow-500 mb-2 text-md text-left font-medium leading-5">
                        {m.name}
                      </h3>

                      <ul className="flex mt-1 space-x-1 text-sm font-normal leading-4 text-coolGray-500">
                        <li>{m.description}</li>
                        <li>&middot;</li>
                        <li className="text-blue-500 hover:underline z-10">
                          {m.url}
                        </li>
                      </ul>

                      <a
                        href="#"
                        className={classNames(
                          "absolute inset-0 rounded-md",
                          "focus:z-10 focus:outline-none focus:ring-2 ring-red-600"
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
