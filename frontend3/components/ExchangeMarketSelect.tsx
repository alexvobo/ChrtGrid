import { useState, useContext, useEffect } from "react";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import CoinbaseLogo from "../public/coinbase.svg";
import KucoinLogo from "../public/kucoin.svg";
import BinanceLogo from "../public/binance.svg";
import { titleCase } from "../util";
import LoadingIcons from "react-loading-icons";
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
  const cooldown = 15000; //Required to prevent spamming of requests, tradingview will ban user
  function listOptions(exchInfo) {
    if (exchInfo) {
      return [
        {
          name: "Best/Worst Gainers",
          market: "stats",
          description: "Pumps & Dumps pls",
          disabled: false,
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
          description: "Straight from the sauce",
          disabled: false,
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
          description: "Random Picks",
          disabled: false,
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
          name: "Custom Lists",
          market: "custom",
          description: "Lifetime/Pro Only",
          disabled: true,
          url: (
            <>
              <p>Coming soon...</p>
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
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group
        defaultIndex={0}
        onChange={(index) => {
          console.log(exchange, market);
          setLoading(true);
          switchExchange(Object.keys(exchanges)[index]);
          setTimeout(() => {
            setLoading(false);
          }, cooldown);
        }}>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
          {Object.keys(exchanges).map((e) => (
            <Tab
              disabled={loading}
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
                {markets?.map((m, i) => (
                  <li
                    key={m.name + i}
                    className={classNames(
                      `${exchangeInfo[e]["marketStyle"]} relative p-3 rounded-md hover:bg-coolGray-100`,
                      m?.market === market ? "bg-indigo-800/50" : ""
                    )}>
                    <button
                      className={m?.disabled ? "cursor-not-allowed" : null}
                      disabled={loading || m?.disabled}
                      onClick={() => {
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
                        <li>{m?.description}</li>
                        <li>&middot;</li>
                        <li className="text-blue-500 hover:underline z-10">
                          {m?.url}
                        </li>
                      </ul>

                      <a
                        href="#"
                        className={classNames(
                          m?.disabled ? "cursor-not-allowed" : null,
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
