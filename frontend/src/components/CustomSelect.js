import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CustomSelect({ label, selected, handleChange, itemList }) {
  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <div className="">
          <Listbox.Label className=" w-auto mr-3 pt-1 block text-xl font-medium text-white">
            {label}
          </Listbox.Label>

          <div className="relative ">
            <Listbox.Button className="w-auto relative  h-10 bg-indigo-800 rounded-sm shadow-sm pl-3 pr-10  text-left cursor-default  sm:text-sm">
              <span className="flex items-center">
                <span className="ml-3 block truncate text-white text-lg">
                  {selected.toUpperCase()}
                </span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-indigo-900 shadow-lg max-h-58 rounded-md py-2 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {itemList.map((item, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-600" : "text-white ",
                        "cursor-defaul text-lg  select-none relative  pl-3 pr-9"
                      )
                    }
                    value={item}>
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              selected
                                ? "font-semibold text-white"
                                : "font-normal",
                              "ml-3 block truncate text-white text-lg"
                            )}>
                            {item.toUpperCase()}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4  text-lg"
                            )}>
                            <CheckIcon
                              className="h-5 w-5 text-white"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
}

export default CustomSelect;
