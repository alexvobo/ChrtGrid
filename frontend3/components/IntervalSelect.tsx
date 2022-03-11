import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { SelectorIcon, CheckIcon } from "@heroicons/react/solid";
import { useLocalStorage } from "../hooks/useLocalStorage";

//Part of the <Account> Component, allows a user to select the interval for the charts and saves it to local storage.
export default function IntervalSelect() {
  const intervals = ["120", "15", "30", "60", "240", "D", "W"];
  const [interval, setInterval] = useLocalStorage("interval", "D");
  return (
    <div className="w-36 absolute left-0 right-0 mx-auto ">
      <Listbox value={interval} onChange={setInterval}>
        <div className="relative mt-1">
          <Listbox.Button className="relative  py-2 pl-3 pr-10 border-2 border-pink-500 bg-transparent text-center rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-md">
            <span className="block truncate font-medium text-white">
              Interval: {interval}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Listbox.Options className=" border-2 border-pink-500 absolute w-full z-[11] py-1 mt-1 overflow-auto text-base bg-slate-900 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-md">
              {intervals.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                      active ? "text-white bg-slate-700" : "text-gray-300"
                    }`
                  }
                  value={item}>
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}>
                        {item}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
