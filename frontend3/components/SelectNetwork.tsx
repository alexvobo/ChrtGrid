import { Fragment, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useMoralis, useChain } from "react-moralis";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { useData } from "../contexts/DataContext";

export default function SelectNetwork() {
  const { switchNetwork, chainId } = useChain();
  const { isWeb3Enabled, deactivateWeb3 } = useMoralis();
  const { networks } = useData();

  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);

  async function changeNetwork(network) {
    if (isWeb3Enabled) {
      let n = selectedNetwork?.chainID;
      await switchNetwork(selectedNetwork?.chainID);
      if (n !== chainId) {
        //network changed
        setSelectedNetwork(network);
      }
    }
  }
  useEffect(() => {
    if (chainId !== selectedNetwork?.chainID) {
      //user changed network manually
      if (chainId === undefined) {
        deactivateWeb3();
      } else {
        const network = networks.find((n) => n?.chainID === chainId);
        setSelectedNetwork(network);
      }
    }
  }, [chainId, switchNetwork, selectedNetwork, deactivateWeb3, networks]);

  return (
    <div className="w-48 z-10">
      <Listbox value={selectedNetwork} onChange={changeNetwork}>
        <div className="relative mb-2 ">
          <Listbox.Button className="border-2 border-red-600 relative w-full py-2 pl-3 pr-10 text-left text-yellow-400 bg-transparent rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-md">
            <span className="block truncate font-medium ">
              {selectedNetwork?.name}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon className="w-5 h-5 text-white" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-slate-900 rounded-md shadow-lg max-h-60 ring-1 ring-red-600 ring-opacity-5 focus:outline-none sm:text-sm">
              {networks?.map((network, netID) => (
                <Listbox.Option
                  key={netID}
                  className={({ active }) =>
                    `${
                      active
                        ? "text-yellow-400 border-2 border-red-600 text-md "
                        : "text-white"
                    }
                          cursor-default relative py-2 pl-10 pr-4 z-10`
                  }
                  value={network}>
                  {({ selected, active }) =>
                    selectedNetwork && (
                      <>
                        <span
                          className={`${
                            selected ? "font-large" : "font-semibold"
                          } block truncate `}>
                          {network?.name}
                        </span>
                        {selected ? (
                          <span className="text-white absolute inset-y-0 left-0 flex items-center pl-3"></span>
                        ) : null}
                      </>
                    )
                  }
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
