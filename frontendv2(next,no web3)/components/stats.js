import LoadingIcons from "react-loading-icons";
import { Transition } from "@headlessui/react";
import useSWR from "swr";

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

export default function Stats({ exchange, maxCharts, sortOrder }) {
  const { data, isValidating, error } = useSWR(`/api/${exchange}/stats`, {
    refreshInterval: 60000,
  });
  // Set Timeout, if timeout then ping = false

  if (error) {
    console.log(error);
  }
  return (
    <>
      <div className="opacity-100 inset-0 overflow-y-auto">
        <div className="text-center">
          <div className="inline-block w-full xs:max-w-sm max-w-sm  md:max-w-md lg:max-w-md 2xl:max-w-lg  p-4 mb-3 overflow-hidden text-left align-middle transition-all transform bg-indigo-900 shadow-xl rounded-sm">
            <div className="text-center text-yellow-400 font-bold">
              24H {sortOrder ? "WORST" : "TOP"} GAINERS
            </div>

            <div className=" grid grid-flow-row ">
              {data ? (
                Object.values(
                  orderBySubKey(
                    data[0]["stats"],
                    "percentage_change",
                    sortOrder
                  )
                ).map(
                  (item, i) =>
                    i < maxCharts && (
                      <a
                        // href={`https://pro.coinbase.com/trade/${stats[item][1]["key"]}-USD`}
                        target="_blank"
                        rel="noreferrer"
                        className=""
                        key={i}>
                        <div className="hover:bg-indigo-700 grid grid-flow-col  border-2 border-indigo-200/0 border-b-indigo-500">
                          <p className="text-md font-medium hover:text-white  text-gray-200 ">
                            {item["key"]}
                            {/* {console.log(item)} */}
                          </p>
                          {console.log(item["value"])}
                          <p
                            className={`text-md font-bold text-right font-medium  ${
                              item["value"]["percentage_change"] > 0
                                ? "hover:text-green-400 text-green-600"
                                : "hover:text-red-400 text-red-600"
                            }`}>
                            {Math.round(item["value"]["percentage_change"], 2)}%
                          </p>
                        </div>
                      </a>
                    )
                )
              ) : (
                <div className="flex justify-center">
                  <LoadingIcons.Bars height="2em" fill="#ffffff" speed={1} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
