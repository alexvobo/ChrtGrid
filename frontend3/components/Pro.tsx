import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Pay from "./Pay";
import {
  RefreshIcon,
  PresentationChartLineIcon,
  CashIcon,
  ArrowSmRightIcon,
  KeyIcon,
} from "@heroicons/react/outline";
import LoadingIcons from "react-loading-icons";
import AddressBar from "./AddressBar";
import { useMoralis } from "react-moralis";
import { useChain } from "react-moralis";
import { useData } from "../contexts/DataContext";

export default function Pro({ isOpen, setIsOpen }) {
  function closeModal() {
    setIsOpen(false);
  }
  const { account } = useMoralis();
  const { chain } = useChain();

  const [paymentData, setPaymentData] = useState({});

  const [membershipTier, setMembershipTier] = useState("lifetime");
  const [membershipCount, setMembershipCount] = useState(null);
  const [membershipMax, setMembershipMax] = useState(null);
  const { networks } = useData();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    if (Object.keys(paymentData).length === 0 && chain && membershipTier) {
      // console.log("Fetching payment data");
      fetch(
        `/api/user/${account}/paymentInfo?network=${chain.chainId}&tier=${membershipTier}`
      )
        .then((res) => res.json())
        .then((data) => {
          setPaymentData(data);
          // console.log(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [account, chain, paymentData, membershipTier]);

  useEffect(() => {
    if (membershipCount === null && membershipMax === null && membershipTier) {
      // console.log("Fetching membership data");
      fetch(`/api/membershipCount?tier=${membershipTier}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setMembershipCount(data["count"]);
          setMembershipMax(data["max"]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [membershipCount, membershipMax, membershipTier]);

  if (chain?.chainId === undefined || account === null) {
    return null;
  }
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className=" fixed inset-0 z-10 overflow-y-auto bg-black/80"
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
              <div className="inline-block w-full max-w-max h-[600px] py-8 px-7  overflow-hidden text-left align-middle transition-all transform bg-blue-900/90 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="border-b-2 border-yellow-500 pb-4 text-4xl text-center font-medium leading-6 text-white">
                  Get{" "}
                  <span className="text-pink-500 ">
                    {membershipTier.toUpperCase()}
                  </span>{" "}
                  Today!
                </Dialog.Title>
                <div className="">
                  <div className=" w-full  ">
                    <p className="text-2xl  text-center text-white mt-2 mb-4">
                      Unlock extra features on{" "}
                      <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-pink-600">
                        GRID
                      </span>{" "}
                      with{" "}
                      <span className="animate-pulse text-pink-500 font-bold">
                        {membershipTier.toUpperCase()}
                      </span>
                    </p>

                    <ul className=" leading-loose  text-center text-xl marker:text-white text-yellow-500">
                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        Whitelist Priority & Lifetime Access [{membershipCount}/
                        {membershipMax} Claimed]
                        <KeyIcon className="inline h-7 w-7 mb-1 ml-2" />{" "}
                      </li>

                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        Premium NFT Giveaways
                        <CashIcon className="inline h-7 w-7  ml-2" />{" "}
                      </li>
                      {/* <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        Latest Listings
                        <ViewListIcon className="inline h-7 w-7 mb-1 ml-2" />{" "}
                      </li> */}
                      <li>
                        <ArrowSmRightIcon className="inline  h-7 w-7  ml-2" />
                        More Charts [9 &#8594; 12]
                        {
                          <PresentationChartLineIcon className="inline mb-1 h-7 w-7 ml-2" />
                        }
                      </li>
                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        Automatic Chart Refreshing
                        <RefreshIcon className="inline h-7 w-7 ml-2" />{" "}
                      </li>

                      <li>
                        <ArrowSmRightIcon className="inline h-7 w-7  ml-2" />
                        New{" "}
                        <span className="mx-2  before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-700 relative inline-block">
                          <span className=" relative text-white font-bold text-xl">
                            PREMIUM
                          </span>
                        </span>{" "}
                        features
                      </li>
                    </ul>
                    <h1 className="text-pink-500 mt-2 text-md text-center font-medium">
                      <span className="text-green-500 px-1">
                        We accept <span className="text-pink-500">ETH</span> and{" "}
                        <span className="text-pink-500">AVAX</span>
                        <span className="text-purple-400">*</span>
                      </span>
                    </h1>
                    <div className="mx-auto text-center">
                      <small className=" text-purple-400 font-medium ">
                        * Please switch networks
                      </small>
                    </div>
                  </div>
                </div>
                <div></div>

                <div className="mt-4  text-center justify-center ">
                  {paymentData &&
                  networks &&
                  membershipTier &&
                  paymentData["payment_amount"] &&
                  paymentData["payment_to"] ? (
                    <>
                      <div className="text-white text-lg py-2 grid grid-flow-row w-1/2 text-center mx-auto bg-slate-900 rounded-md ">
                        <span className=" border-b-2 border-yellow-500 font-bold text-red-600 mb-2">
                          Please Verify:
                        </span>
                        <AddressBar
                          account={paymentData["payment_to"]}
                          chainId={chain.chainId}
                          ENSName={""}
                          copyAddress={true}
                        />
                        <span>
                          {" "}
                          Price: {paymentData["payment_amount"]}{" "}
                          {
                            networks?.find((n) => n?.chainID === chain?.chainId)
                              ?.currencyName
                          }
                        </span>
                      </div>

                      <div className="mt-5 ">
                        <Pay
                          amount={paymentData["payment_amount"]}
                          receiver={paymentData["payment_to"]}
                          tier={membershipTier}
                          modalController={setIsOpen}
                        />
                      </div>
                    </>
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
