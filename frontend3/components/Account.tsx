import { useEffect, useState } from "react";

import useENSName from "../hooks/useENSName";
import { useMoralis } from "react-moralis";
import { useAccount } from "../contexts/AccountContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ETHBalance from "../components/ETHBalance";

import Pro from "./Pro";
import Plaque from "./Plaque";
import AddressBar from "./AddressBar";

import LoadingIcons from "react-loading-icons";

const FREE = "free";
// Account component, displays user data after login with metamask.
// Shows address, balance, membership status, interval configuration, and allows the user to "Go Pro" or configure custom lists if they are already Pro.
export default function Account() {
  const { account, chainId, isWeb3Enabled, deactivateWeb3 } = useMoralis();
  const ENSName = useENSName(account);
  const { userData } = useAccount();

  const [openModal, setOpenModal] = useState(false);
  const [loggedIn, setLoggedIn] = useLocalStorage("loggedIn", "");

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

  if (userData === undefined || userData === null || loggedIn === "false") {
    <div className="flex justify-center items-center">
      <LoadingIcons.Bars height="5em" fill="white" speed={0.75} />
    </div>;
  }
  return (
    <>
      <div className="text-white relative">
        <div className=" z-[100] pt-2 h-[80px] py-1 pb-2 rounded-md absolute w-full lg:w-[500px]  lg:right-12   top-[-9px] max-w-full   bg-transparent  border-b-2 border-x-2 border-yellow-600  ">
          <div className="flex text-center ">
            <div className="m-auto">
              <h3 className="text-yellow-500 font-medium  text-md md:text-lg">
                Address
              </h3>
              <div className="w-full  text-md font-medium  ">
                <AddressBar
                  account={account}
                  chainId={chainId}
                  ENSName={ENSName}
                  copyAddress={false}
                />
              </div>
            </div>
            <div className="m-auto ">
              <h3 className="text-md md:text-lg  font-medium  text-yellow-500 ">
                Tier
              </h3>

              {!userData || userData?.membership === FREE ? (
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className=" hover:animate-pulse  bg-red-700 hover:bg-red-800 text-white font-bold  py-1 px-3  rounded">
                  Go Pro
                </button>
              ) : (
                <Plaque
                  membership={
                    userData?.membership ? userData?.membership : FREE
                  }
                />
              )}
            </div>
            <div className="m-auto ">
              <h3 className="text-yellow-500 font-medium  mb-1 text-md md:text-lg">
                Balance
              </h3>
              <div className=" align-center">
                <ETHBalance className="text-md md:text-lg font-medium " />
              </div>
            </div>

            <div className="m-auto">
              <button
                className=" text-sm md:text-lg text-center mt-2  h-8 px-2 md:px-4 rounded-sm bg-transparent hover:bg-red-600  font-medium hover:text-white   border-2 border-pink-500 hover:border-transparent "
                disabled={!isWeb3Enabled}
                onClick={async () => {
                  await deactivateWeb3();
                  setLoggedIn("false");

                  localStorage.setItem("market", "stats");
                }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <Pro isOpen={openModal} setIsOpen={setOpenModal} />
    </>
  );
}
{
  /* <div>
<div className="mt-8 relative  ">
  <IntervalSelect />
  <a
    onClick={refreshPage}
    data-tip
    data-for="refresh"
    className="hover:cursor-pointer inline-block  absolute right-1/4 top-3 ">
    <RefreshIcon className="text-pink-500 hover:text-white absolute h-7 w-7 " />
  </a>
  <ReactTooltip
    id="refresh"
    place="right"
    type="info"
    effect="float">
    <span>Refresh to change interval</span>
  </ReactTooltip>
</div>
</div> */
}
{
  /* <div className="grid grid-rows-4 text-center  ">
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
          className=" h-8 w-1/2 rounded-sm bg-transparent hover:bg-red-600 text-black-400 font-medium hover:text-black   border-2 border-pink-500 hover:border-transparent "
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
  {!userData || userData?.membership === FREE ? (
    <button
      type="button"
      onClick={() => setOpenModal(true)}
      className=" hover:animate-pulse  bg-red-700 hover:bg-red-800 text-white font-bold  py-2 px-4  rounded">
      Go Pro
    </button>
  ) : null}
</div>

<div>
  <div className="mt-8 relative  ">
    <IntervalSelect />
    <a
      onClick={refreshPage}
      data-tip
      data-for="refresh"
      className="hover:cursor-pointer inline-block  absolute right-1/4 top-3 ">
      <RefreshIcon className="text-pink-500 hover:text-white absolute h-7 w-7 " />
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
</div> */
}
