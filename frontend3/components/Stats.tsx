import { useState } from "react";
import LoadingIcons from "react-loading-icons";
import { useData } from "../contexts/DataContext";
function orderBySubKey(input, key, order) {
  //Ascending
  if (order) {
    return Object.keys(input)
      .map((key) => ({ key, value: input[key] }))
      .sort((a, b) => a.value[key] - b.value[key]);
  } else {
    //Descending
    return Object.keys(input)
      .map((key) => ({ key, value: input[key] }))
      .sort((a, b) => b.value[key] - a.value[key]);
  }
}
function moneyFormat(labelValue) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + " B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + " M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + " K"
    : Math.abs(Number(labelValue));
}
function decimalFormat(labelValue) {
  return String(Number(labelValue));
}
const exchangeThemes = {
  coinbase: {
    exchangeStyle: " hover:bg-blue-600 border-indigo-200/0 border-b-blue-600 ",
    titleFont: "text-blue-600 justify-stretch",
    font: " text-white hover:text-white justify-stretch",
  },
  kucoin: {
    titleFont: "text-[#23af91] justify-stretch",

    exchangeStyle:
      " hover:bg-[#23af91] border-indigo-200/0 border-b-[#23af91] ",
    font: " text-white hover:text-white justify-stretch",
  },

  binance: {
    titleFont: "text-white justify-stretch",
    exchangeStyle:
      " hover:bg-yellow-500  border-indigo-200/0 border-b-yellow-500 ",
    font: " text-white hover:text-black justify-stretch",
  },
};

//Displays the 24h stats for the selected exchange. Updates based on SWR.
export default function Stats() {
  const [sortCategory, setSortCategory] = useState("percentage_change");
  const [sortAscending, setSortAscending] = useState(false);

  const { exchange, stats } = useData();
  const maxCharts = 12;

  return (
    <>
      <div className="mt-10 opacity-100 inset-0 overflow-y-auto ">
        <div className="text-center">
          <div className="inline-block w-full  max-w-sm  md:max-w-md lg:max-w-md 2xl:max-w-lg  p-4 mb-2  text-left align-middle transition-all transform bg-transparent ">
            <div className="text-center text-yellow-500 font-bold text-2xl mb-4 ">
              24H{" "}
              <span className={exchangeThemes[exchange]?.titleFont}>
                {exchange.toUpperCase()}
              </span>{" "}
              {sortAscending ? "WORST GAINERS 😭" : "TOP GAINERS 🚀"}
            </div>

            <div className=" grid grid-flow-row  ">
              <div className="text-yellow-500 grid grid-flow-col  border-b-2 border-b-purple-700 text-xl pb-1 font-medium ">
                <p className="text-left pl-2">Symbol</p>{" "}
                <p className="text-center">Price</p>
                {/* <p className="text-right">Volume</p> */}
                <p className="text-right pr-2">Change</p>
                <p className="text-right pr-2 ">Max</p>
              </div>

              {stats && stats !== undefined && Object.keys(stats).length > 1 ? (
                Object.values(
                  orderBySubKey(stats, sortCategory, sortAscending)
                ).map(
                  (item, i) =>
                    i < maxCharts && (
                      <a
                        href={`https://www.tradingview.com/symbols/${
                          item["key"]
                        }${
                          exchange === "coinbase" ? "USD" : "USDT"
                        }/?exchange=${exchange}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`${exchangeThemes[exchange]["font"]}`}
                        key={i}>
                        <div
                          className={
                            `hover:text-xl hover:pl-2 hover:pr-2  leading-7  grid grid-flow-col border-2  ` +
                            exchangeThemes[exchange]["exchangeStyle"] +
                            exchangeThemes[exchange]["font"]
                          }>
                          <p className={`pl-4 text-md font-bold text-left `}>
                            {item["key"]}
                          </p>
                          {/* Changes price color based on % change. May remove in future. */}
                          <p className={`text-md font-bold text-center  `}>
                            ${decimalFormat(item["value"]["last"])}
                          </p>
                          {/* {console.log(item["value"])} */}
                          {/* <p className="text-md font-medium hover:text-white  text-gray-200 text-center ">
                            {moneyFormat(item["value"]['volume']*item["value"]["last"])}
                          </p> */}
                          <p
                            className={`text-md font-bold text-right pr-4 ${
                              item["value"]["percentage_change"] > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}>
                            {Math.round(item["value"]["percentage_change"])}%
                          </p>
                          <p
                            className={`text-md font-bold text-right pr-4 ${
                              item["value"]["percentage_change_24"] > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}>
                            {Math.round(item["value"]["percentage_change_24"])}%
                          </p>
                        </div>
                      </a>
                    )
                )
              ) : (
                <div className="flex justify-center mt-4 z-10">
                  <LoadingIcons.Bars height="2em" fill="#ffffff" speed={1} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-center mb-4 flex ">
          <button
            className="mx-auto mr-2 w-[135px] text-lg border-2  bg-transparent hover:bg-yellow-400 text-yellow-400 font-bold hover:text-black py-1 px-2 border-red-700 hover:border-transparent rounded  "
            onClick={() => {
              setSortAscending(!sortAscending);
              setSortCategory("percentage_change");
            }}>
            Sort Change
          </button>

          <button
            className="mx-auto ml-2 w-[125px] text-lg border-2  bg-transparent hover:bg-yellow-400 text-yellow-400 font-bold hover:text-black py-1 px-2 border-red-700 hover:border-transparent rounded  "
            onClick={() => {
              setSortAscending(!sortAscending);
              setSortCategory("percentage_change_24");
            }}>
            Sort Max
          </button>
        </div>
      </div>
    </>
  );
}
