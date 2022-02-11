import { useState } from "react";
import useSWR from "swr";

import { Tab } from "@headlessui/react";
import LoadingIcons from "react-loading-icons";

import { titleCase } from "../util";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const exchangeList = [
  {
    name: "Coinbase",
    selectedstyle: "bg-blue-700 text-white",
    unavailable: false,
  },
  {
    name: "Kucoin",
    selectedstyle: "bg-[#23af91] text-white",
    unavailable: true,
  },
  {
    name: "Binance",
    selectedstyle: "bg-yellow-500 text-black",
    unavailable: true,
  },
];

export default function ExchangeSelect() {
  const [exchange, setExchange] = useState(exchangeList[0].name);

  return (
    <div className="mx-auto w-full max-w-md px-2 py-8 sm:px-0">
      <Tab.Group
        defaultIndex={0}
        onChange={(index) => {
          setExchange(exchangeList[index]["name"]);
        }}>
        <Tab.List className="flex p-1 space-x-1 bg-indigo-800/60 rounded-xl">
          {exchangeList.map((e) => (
            <Tab
              data-tooltip-target="tooltip-default"
              key={e.name}
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-md leading-5 font-medium text-white rounded-lg",
                  selected
                    ? `shadow  ${e.selectedstyle}`
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }>
              {titleCase(e.name)}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}
