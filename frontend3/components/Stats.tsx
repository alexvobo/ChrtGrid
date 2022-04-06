import { useState, useMemo, useEffect } from "react";
import LoadingIcons from "react-loading-icons";
import { useData } from "../contexts/DataContext";
import useSWR from "swr";
import Table from "./Table";
import { SortAscendingIcon, SortDescendingIcon } from "@heroicons/react/solid";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
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
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(1) + " B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(1) + " M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(1) + " K"
    : Math.abs(Math.round(Number(labelValue)));
}

const exchangeThemes = {
  coinbase: {
    titleFont: "text-blue-600 justify-stretch",
    borderStyle: "border-blue-600 border-2 border-b-0 rounded-sm",
    exchangeStyle:
      " hover:text-white hover:bg-blue-600 border-indigo-200/0 border-b-blue-600  text-shadow-black ",
  },
  kucoin: {
    titleFont: "text-[#23af91] justify-stretch",
    borderStyle: "border-[#23af91] border-2 border-b-0 rounded-sm",
    exchangeStyle:
      " hover:bg-[#23af91] border-indigo-200/0 border-b-[#23af91]  text-shadow-black ",
  },

  binance: {
    titleFont: "text-white justify-stretch",
    borderStyle: "border-yellow-500 border-2 border-b-0 rounded-sm ",
    exchangeStyle:
      "hover:text-black  hover:bg-yellow-500  border-indigo-200/0 border-b-yellow-500  ",
  },
};

//Displays the 24h stats for the selected exchange. Updates based on SWR.
export default function Stats(wide) {
  const columns = useMemo(
    () => [
      {
        Header: " ",
        columns: [
          {
            Header: "Symbol",
            accessor: "key",
          },
          {
            Header: "Price ($)",
            accessor: "value.last",
          },
          {
            Header: "Change",
            accessor: "value.percentage_change",
            Cell: ({ cell: { value } }) => {
              let rounded_pct: number = Math.round(value);

              return (
                <span
                  className={classNames(
                    "text-md font-bold",
                    rounded_pct >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                  {rounded_pct}%
                </span>
              );
            },
          },
          {
            Header: "Max Gain",
            accessor: "value.percentage_change_24",
            Cell: ({ cell: { value } }) => {
              let rounded_pct: number = Math.round(value);

              return (
                <span
                  className={classNames(
                    "text-md font-bold",
                    rounded_pct >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                  {rounded_pct}%
                </span>
              );
            },
          },
          {
            Header: "Volume",
            accessor: "value.volume",
            Cell: ({ cell: { value } }) => {
              return <>{moneyFormat(value)}</>;
            },
          },
        ],
      },
    ],
    []
  );
  const [sortCategory, setSortCategory] = useState("percentage_change");
  const [sortAscending, setSortAscending] = useState(false);
  const [showChange, setShowChange] = useState(true);
  const [showMax, setShowMax] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [titleSortingText, setTitleSortingText] = useState("GAINERS");
  const { exchange } = useData();

  const { data: stats } = useSWR(
    exchange ? `/api/${exchange}/stats` : null,
    (url) => fetch(url).then((r) => r.json())
  );

  useEffect(() => {
    if (showVolume) {
      setTitleSortingText("VOLUME");
    } else {
      if (titleSortingText != "GAINERS") {
        setTitleSortingText("GAINERS");
      }
    }
  }, [showChange, showMax, showVolume]);

  return (
    <>
      <div className="mt-10 opacity-100 inset-0 overflow-x-show ">
        <div className="text-center">
          <div
            className={classNames(
              "inline-block w-full md:ml-4  p-4 mb-2 text-left align-middle transition-all transform bg-transparent overflow-x-show "
            )}>
            <div className="text-center text-yellow-500 font-bold text-2xl mb-4  ">
              <span className={exchangeThemes[exchange]?.titleFont}>
                {exchange.toUpperCase()}
              </span>{" "}
              {sortAscending
                ? "WORST " + titleSortingText + " 😭"
                : "TOP " + titleSortingText + " 🚀"}
            </div>
            {stats && stats !== undefined && Object.keys(stats).length > 1 ? (
              <Table
                exchangeStyle={exchangeThemes[exchange]}
                columns={columns}
                data={Object.values(
                  orderBySubKey(stats, sortCategory, sortAscending)
                ).slice(0, 15)}
              />
            ) : null}
          </div>
          <div className="text-center mb-4 flex mx-auto justify-center  ">
            <div className="border-pink-500 border-2 rounded ">
              <button
                className=" min-w-[75px] text-lg  bg-transparent  text-white font-bold  py-1 px-2 pr-6 border-pink-500   hover:text-pink-500 rounded-sm  "
                onClick={() => {
                  setSortAscending(!sortAscending);
                  setSortCategory("percentage_change_24");
                  setShowChange(false);
                  setShowMax(true);
                  setShowVolume(false);
                }}>
                <span className="flex">
                  <span
                    className={classNames(
                      "my-auto",
                      !showMax ? "invisible" : "visible"
                    )}>
                    {sortAscending ? (
                      <SortAscendingIcon className="h-5 w-5 my-auto mx-2  " />
                    ) : (
                      <SortDescendingIcon className="h-5 w-5 my-auto mx-2" />
                    )}{" "}
                  </span>
                  Max
                </span>
              </button>
              <button
                className=" min-w-[75px] text-lg   border-x-2 bg-transparent text-white font-bold py-1 px-2 border-pink-500  hover:text-pink-500 rounded-sm  "
                onClick={() => {
                  setSortAscending(!sortAscending);
                  setSortCategory("percentage_change");
                  setShowChange(true);
                  setShowMax(false);
                  setShowVolume(false);
                }}>
                <span className="flex my-auto">
                  <span
                    className={classNames(
                      "my-auto",
                      !showChange ? "invisible" : "visible"
                    )}>
                    {sortAscending ? (
                      <SortAscendingIcon className="h-5 w-5 my-auto mx-2 " />
                    ) : (
                      <SortDescendingIcon className="h-5 w-5 my-auto mx-2" />
                    )}
                  </span>
                  Change
                </span>
              </button>

              <button
                className=" text-lg bg-transparent text-white font-bold py-1 px-2 pr-6 border-pink-500 hover:border-white hover:text-pink-500 rounded  "
                onClick={() => {
                  setSortAscending(!sortAscending);
                  setSortCategory("volume");
                  setShowChange(false);
                  setShowMax(false);
                  setShowVolume(true);
                }}>
                <span className="flex my-auto">
                  <span
                    className={classNames(
                      "my-auto",
                      !showVolume ? "invisible" : "visible"
                    )}>
                    {sortAscending ? (
                      <SortAscendingIcon className="h-5 w-5 my-auto mx-2" />
                    ) : (
                      <SortDescendingIcon className="h-5 w-5 my-auto mx-2" />
                    )}
                  </span>
                  Vol
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
