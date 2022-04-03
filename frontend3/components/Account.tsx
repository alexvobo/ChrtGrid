import { useEffect, useState } from "react";

import useENSName from "../hooks/useENSName";
import { useMoralis } from "react-moralis";
import { useAccount } from "../contexts/AccountContext";

import ETHBalance from "../components/ETHBalance";
import IntervalSelect from "../components/IntervalSelect";
import Pro from "./Pro";
import Plaque from "./Plaque";
import AddressBar from "./AddressBar";
import CustomList from "./CustomList";

import LoadingIcons from "react-loading-icons";
import ReactTooltip from "react-tooltip";
import { RefreshIcon } from "@heroicons/react/outline";

// Account component, displays user data after login with metamask.
// Shows address, balance, membership status, interval configuration, and allows the user to "Go Pro" or configure custom lists if they are already Pro.
const Account = () => {
  const { account, chainId } = useMoralis();
  const ENSName = useENSName(account);
  const { userData } = useAccount();

  const [openModal, setOpenModal] = useState(false);
  const [customListOpen, setCustomListOpen] = useState(false);

  function refreshPage() {
    window.location.reload();
  }

  useEffect(() => {
    if (typeof account === "string" && account.length > 0) {
      fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({ account }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }, [account]);

  if (userData === undefined || userData === null) {
    <div className="flex justify-center items-center">
      <LoadingIcons.Bars height="5em" fill="white" speed={0.75} />
    </div>;
  }
  return (
    <>
      <div className="text-white mb-5 ">
        <div className="inline-block w-[350px] md:w-[280px] lg:w-[350px] pb-4 max-w-md     align-middle bg-transparent  border-2 border-yellow-500/70 shadow-lg shadow-blue-700 rounded-xl">
          <div className="grid grid-rows-4 text-center  ">
            <div className="">
              <div className="text-3xl font-medium border-b-2 border-yellow-400 py-2  text-white-500">
                Profile
              </div>
              <div className="mt-2">
                <h3 className="text-xl font-medium   text-yellow-500">
                  Account
                </h3>
                <div className="w-2/3 mx-auto font-medium   ">
                  <AddressBar
                    account={account}
                    chainId={chainId}
                    ENSName={ENSName}
                    copyAddress={false}
                  />
                </div>
              </div>
            </div>
            <div className="m-auto">
              <h3 className="text-xl font-medium text-yellow-500 ">Balance</h3>
              <ETHBalance className="text-lg font-medium " />
            </div>

            <div className=" ">
              <h3 className="text-xl pb-2 font-medium  text-yellow-500 ">
                Membership
              </h3>
              <Plaque
                membership={
                  userData?.membership ? userData?.membership : "free"
                }
              />
              {!userData || userData?.membership === "free" ? (
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className=" hover:animate-pulse  bg-red-700 hover:bg-red-800 text-white font-bold  py-2 px-4  rounded">
                  Go Pro
                </button>
              ) : (
                // <div className="grid grid-flow-col border-2 w-3/4 mx-auto">
                //Buttons here to set chart intervals, etc.
                // </div>
                <button
                  className="bg-red-700 hover:bg-red-800 rounded-sm font-medium w-40 h-10 mx-auto "
                  onClick={() => setCustomListOpen(!customListOpen)}>
                  Custom List Config
                </button>
              )}
            </div>
            <div className="mt-4 relative  ">
              <IntervalSelect />
              <a
                onClick={refreshPage}
                data-tip
                data-for="refresh"
                className="hover:cursor-pointer inline-block  absolute right-1/4 top-3 ">
                <RefreshIcon className="text-pink-500  absolute h-7 w-7 " />
              </a>
              <ReactTooltip
                id="refresh"
                place="right"
                type="info"
                effect="float">
                <span>Refresh to change interval</span>
              </ReactTooltip>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <Pro isOpen={openModal} setIsOpen={setOpenModal} />
      <CustomList isOpen={customListOpen} setIsOpen={setCustomListOpen} />
    </>
  );
};

export default Account;
