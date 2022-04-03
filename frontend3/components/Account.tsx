import { useEffect, useState } from "react";

import useENSName from "../hooks/useENSName";
import { useMoralis } from "react-moralis";
import { useAccount } from "../contexts/AccountContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ETHBalance from "../components/ETHBalance";
import IntervalSelect from "../components/IntervalSelect";
import Pro from "./Pro";
import Plaque from "./Plaque";
import AddressBar from "./AddressBar";

import LoadingIcons from "react-loading-icons";
import ReactTooltip from "react-tooltip";
import { RefreshIcon } from "@heroicons/react/outline";

const FREE = "free";
// Account component, displays user data after login with metamask.
// Shows address, balance, membership status, interval configuration, and allows the user to "Go Pro" or configure custom lists if they are already Pro.
export default function Account() {
  const { account, chainId, isWeb3Enabled, deactivateWeb3 } = useMoralis();
  const ENSName = useENSName(account);
  const { userData } = useAccount();

  const [openModal, setOpenModal] = useState(false);
  const [loggedIn, setLoggedIn] = useLocalStorage("loggedIn", "");

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
      <div className="text-white mb-5 mt-4 ">
        <div className="inline-block h-[620px] w-[350px] md:w-[280px] lg:w-[350px] pb-4 max-w-md     align-middle bg-transparent  border-2 border-yellow-500/70 shadow-lg shadow-blue-700 rounded-xl">
          <div className="grid grid-rows-4 text-center  ">
            <div className="">
              <div className="text-2xl font-medium border-b-2 border-yellow-500 py-2  text-white-500">
                Profile
              </div>
              <div className="mt-2">
                <h3 className="text-2xl font-medium   text-yellow-500">
                  Account
                </h3>
                <div className="w-2/3 mx-auto font-medium   ">
                  <AddressBar
                    account={account}
                    chainId={chainId}
                    ENSName={ENSName}
                    copyAddress={false}
                  />
                  <div className="mx-auto mt-4">
                    <button
                      className=" h-8 w-1/2 rounded-sm bg-transparent hover:bg-yellow-400 text-yellow-400 font-medium hover:text-black   border-2 border-red-600 hover:border-transparent "
                      disabled={!isWeb3Enabled}
                      onClick={async () => {
                        await deactivateWeb3();
                        localStorage.setItem("market", "stats");
                        setLoggedIn("false");
                      }}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6  flex">
              <div className=" align-center m-auto">
                <h3 className=" text-2xl font-medium text-yellow-500 ">
                  Balance
                </h3>
                <ETHBalance className=" text-xl font-medium " />
              </div>
            </div>
            <div className="mt-6 ">
              <h3 className="text-2xl pb-2 font-medium  text-yellow-500 ">
                Membership
              </h3>
              <Plaque
                membership={userData?.membership ? userData?.membership : FREE}
              />
            </div>

            <div>
              {!userData || userData?.membership === FREE ? (
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className=" hover:animate-pulse  bg-red-700 hover:bg-red-800 text-white font-bold  py-2 px-4  rounded">
                  Go Pro
                </button>
              ) : null}
              <div className="mt-8 relative  ">
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
      </div>
      {/* Modals */}
      <Pro isOpen={openModal} setIsOpen={setOpenModal} />
    </>
  );
}
