import React from "react";
import LoadingIcons from "react-loading-icons";
import { Transition } from "@headlessui/react";
export default function Stats({ stats, pulse }) {
  return (
    <div className="inset-0 overflow-y-auto">
      <div className="text-center">
        <Transition
          show={pulse}
          enter="transition-opacity duration-[5000ms]"
          enterFrom="opacity-70"
          enterTo="opacity-100"
          leave="transition-opacity duration-[5000ms]"
          leaveFrom="opacity-100"
          leaveTo="opacity-70">
          <div className="inline-block w-full xs:max-w-sm max-w-sm  md:max-w-md lg:max-w-md 2xl:max-w-lg  p-4 mb-3 overflow-hidden text-left align-middle transition-all transform bg-indigo-900 shadow-xl rounded-sm">
            <div className="text-center text-yellow-400 font-bold">
              24H TOP GAINERS
            </div>

            <div className=" grid grid-flow-row ">
              {stats.length > 0 ? (
                Object.keys(stats).map((item, i) => (
                  <a
                    href={`https://pro.coinbase.com/trade/${stats[item][1]["key"]}-USD`}
                    target="_blank"
                    rel="noreferrer"
                    className="">
                    <div
                      key={i}
                      className="hover:bg-indigo-700 grid grid-flow-col  border-2 border-indigo-200/0 border-b-indigo-500">
                      <p className="text-md font-medium hover:text-white  text-gray-200 ">
                        {stats[item][1]["key"]}
                      </p>
                      <p
                        className={`text-md font-bold text-right font-medium  ${
                          stats[item][1]["value"]["percentage_change"] > 0
                            ? "hover:text-green-400 text-green-600"
                            : "hover:text-red-400 text-red-600"
                        }`}>
                        {Math.round(
                          stats[item][1]["value"]["percentage_change"],
                          2
                        )}
                        %
                      </p>
                    </div>
                  </a>
                ))
              ) : (
                <div className="flex justify-center">
                  <LoadingIcons.Bars height="2em" fill="#55555" speed={1} />
                </div>
              )}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
