import { Fragment, useState } from "react";
import { TickerTape, TickerTapeSymbol } from "react-ts-tradingview-widgets";
import Link from "next/link";
import Image from "next/image";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import Blob from "./Blob";
import GRID from "../public/grid-nav.svg";
import useSWR from "swr";

const navigation = [
  { name: "Help", href: "/", current: true },
  // { name: "Accounts", href: "/account", current: false },
  { name: "Bot", href: "/bot", current: false },
];
const tickers: TickerTapeSymbol[] = [
  {
    proName: "FOREXCOM:SPXUSD",
    title: "S&P 500",
  },
  {
    proName: "FOREXCOM:NSXUSD",
    title: "Nasdaq 100",
  },
  {
    proName: "FOREXCOM:DJI",
    title: "Dow Jones",
  },
  {
    proName: "INDEX:BTCUSD",
    title: "Bitcoin",
  },
  {
    proName: "CRYPTOCAP:BTC.D",
    title: "BTC Dominance",
  },
  {
    proName: "INDEX:ETHUSD",
    title: "Ethereum",
  },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

{
  /* <span className="text-white relative ">
            {true ? <Blob color="green" /> : <Blob color="red" />}
          </span> */
}
export default function Navbar() {
  const { data: ping } = useSWR("/api/ping", (url) =>
    fetch(url).then((r) => r.json())
  );

  return (
    <Disclosure
      as="nav"
      className="bg-transparent border-b-2 border-yellow-600">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden md:block  items-center mt-2 ">
                  <Image
                    className="rotate-180 "
                    height={80}
                    width={80}
                    src={GRID}
                    alt="GRID"
                  />
                </div>

                <div className="hidden sm:block sm:ml-6 md:mt-6">
                  <div className="flex space-x-4 ">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <a
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "px-3 py-2 rounded-md  font-medium text-md"
                          )}
                          aria-current={item.current ? "page" : undefined}>
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* TickerTape */}
              </div>
              <div className=" relative w-2/3 right-24  sm:w-1/2 sm:right-4 md:w-1/2 lg:w-1/2 lg:right-5 xl:w-3/5 mb-1 overflow-hidden h-[68px]">
                <TickerTape
                  colorTheme="dark"
                  isTransparent={true}
                  symbols={tickers}
                />
              </div>

              {/* Blob */}
              <div className="absolute  inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <span className="text-white  ">
                  {ping && ping["status"] === true ? (
                    <Blob color="green" />
                  ) : (
                    <Blob color="red" />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}>
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
