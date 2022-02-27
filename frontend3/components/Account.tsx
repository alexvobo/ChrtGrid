import { useEffect, useState } from "react";

import ETHBalance from "../components/ETHBalance";
import LoadingIcons from "react-loading-icons";
import Pro from "./Pro";

import useENSName from "../hooks/useENSName";
import { useMoralis } from "react-moralis";
import { useAccount } from "../contexts/AccountContext";
import Plaque from "./Plaque";
import AddressBar from "./AddressBar";
import CustomList from "./CustomList";

const Account = () => {
  const { account, chainId } = useMoralis();
  const ENSName = useENSName(account);
  const { userData } = useAccount();

  const [openModal, setOpenModal] = useState(false);
  const [customListOpen, setCustomListOpen] = useState(false);

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
        <div className="inline-block w-[350px] max-w-md    overflow-hidden align-middle bg-transparent  border-2 border-yellow-500/70 shadow-lg shadow-blue-700 rounded-xl">
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

            <div className="">
              <h3 className="text-xl pb-2 font-medium  text-yellow-500 ">
                Membership
              </h3>
              <Plaque
                membership={
                  userData?.membership ? userData?.membership : "free"
                }
              />
            </div>
            {!userData || userData?.membership === "free" ? (
              <div className="">
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className=" hover:animate-pulse mt-3 mb-1 bg-transparent hover:bg-red-600 text-yellow-400 font-bold hover:text-black py-2 px-4 border-2 border-red-600 hover:border-transparent rounded">
                  Go Pro
                </button>
                <Pro isOpen={openModal} setIsOpen={setOpenModal} />
              </div>
            ) : (
              // <div className="grid grid-flow-col border-2 w-3/4 mx-auto">
              //Buttons here to set chart intervals, etc.
              // </div>
              <button
                className="bg-red-700 hover:bg-red-800 rounded-sm font-medium w-40 h-10 mx-auto mt-4"
                onClick={() => setCustomListOpen(!customListOpen)}>
                Custom List Config
              </button>
            )}
          </div>
        </div>
      </div>
      <CustomList isOpen={customListOpen} setIsOpen={setCustomListOpen} />
      {/* </Transition> */}
    </>
  );
};

export default Account;
