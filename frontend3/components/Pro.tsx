import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Pay from "./Pay";
import {
  ChartBarIcon,
  DatabaseIcon,
  ArrowSmRightIcon,
  ViewListIcon,
  KeyIcon,
} from "@heroicons/react/solid";
import { RefreshIcon } from "@heroicons/react/outline";
import LoadingIcons from "react-loading-icons";
import { useMoralis } from "react-moralis";
import { useChain } from "react-moralis";
import axios from "axios";
export default function Pro({ isOpen, setIsOpen }) {
  function closeModal() {
    setIsOpen(false);
  }
  const { account } = useMoralis();
  const { chain } = useChain();

  const [paymentData, setPaymentData] = useState({});
  const [membershipTier, setMembershipTier] = useState("LIFETIME");

  const [membershipCount, setMembershipCount] = useState(null);
  const [membershipMax, setMembershipMax] = useState(null);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    if (Object.keys(paymentData).length === 0 && chain && membershipTier) {
      console.log("Fetching payment data");
      fetch(
        `/api/user/${account}/paymentInfo?network=${chain.chainId}&tier=${membershipTier}`
      )
        .then((res) => res.json())
        .then((data) => {
          setPaymentData(data);
          console.log(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [account, chain, paymentData, membershipTier]);

  useEffect(() => {
    if (membershipCount === null && membershipMax === null && membershipTier) {
      console.log("Fetching membership data");
      fetch(`/api/user/membershipCount?tier=${membershipTier}`)
        .then((res) => res.json())
        .then((data) => {
          setMembershipCount(data["count"]);
          setMembershipMax(data["max"]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [membershipCount, membershipMax, membershipTier]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto bg-black/80"
          onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className="inline-block w-full max-w-max h-[500px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-blue-900/90 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="border-b-2 border-yellow-500 pb-4 text-4xl text-center font-medium leading-6 text-white">
                  Go Pro Today!
                </Dialog.Title>
                <div className="">
                  <div className="mt-8 w-full p-4">
                    <p className="text-2xl  text-center text-white mb-8">
                      Unlock extra features on GRID with Pro
                    </p>

                    <ul className=" leading-loose  text-center text-xl marker:text-white text-yellow-500">
                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        Whitelist Priority [{membershipCount}/{membershipMax}{" "}
                        Claimed]
                        <KeyIcon className="inline h-7 w-7 mb-2 ml-2" />{" "}
                      </li>
                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        Access to Exclusive Giveaways
                        <ViewListIcon className="inline h-7 w-7 mb-2 ml-2" />{" "}
                      </li>
                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        View Latest Listings
                        <ViewListIcon className="inline h-7 w-7 mb-2 ml-2" />{" "}
                      </li>
                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        More Charts on Screen [6 &#8594; 12]
                        <ChartBarIcon className="inline h-7 w-7 ml-2" />
                      </li>
                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        Automatic Chart Refreshing{" "}
                        <RefreshIcon className="inline h-7 w-7 ml-2" />{" "}
                      </li>
                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        Additional Exchange Support
                        <DatabaseIcon className="inline h-7 w-7 mb-2 ml-2" />{" "}
                      </li>
                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        + More!
                        <DatabaseIcon className="inline h-7 w-7 mb-2 ml-2" />{" "}
                      </li>
                    </ul>
                  </div>
                </div>
                <div></div>

                <div className="mt-4 text-center justify-center grid grid-flow-col gap-10  ">
                  <button
                    type="button"
                    className="px-4 py-2 text-md font-bold text-blue-900 bg-blue-300 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}>
                    Maybe Later
                  </button>

                  {paymentData &&
                  membershipTier &&
                  membershipCount <= membershipMax &&
                  paymentData["payment_amount"] &&
                  paymentData["payment_to"] ? (
                    <Pay
                      amount={paymentData["payment_amount"]}
                      receiver={paymentData["payment_to"]}
                      tier={membershipTier}
                    />
                  ) : (
                    <LoadingIcons.SpinningCircles />
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
