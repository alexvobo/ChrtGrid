import { useEffect, useState } from "react";

import ETHBalance from "../components/ETHBalance";
import LoadingIcons from "react-loading-icons";
import Pro from "./Pro";

import useENSName from "../hooks/useENSName";
import { useMoralis } from "react-moralis";
import { useAccount } from "../contexts/AccountContext";
import Plaque from "./Plaque";
import AddressBar from "./AddressBar";

const Account = () => {
  const { account, chainId } = useMoralis();
  const ENSName = useENSName(account);
  const { userData } = useAccount();

  const [openModal, setOpenModal] = useState(false);

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
        <div className="inline-block w-[350px] max-w-md  p-2  overflow-hidden align-middle bg-transparent rounded border-4 border-pink-600 shadow-lg shadow-blue-700 ">
          <div className="grid grid-rows-4 text-center mb-3 gap-3">
            <div className="">
              <h3 className="text-xl font-medium   text-yellow-500">Account</h3>
              <div className="w-2/3 mx-auto font-medium   ">
                <AddressBar
                  account={account}
                  chainId={chainId}
                  ENSName={ENSName}
                  copyAddress={false}
                />
              </div>
            </div>
            <div className="">
              <h3 className="text-xl font-medium text-yellow-500 mb-2">
                Balance
              </h3>
              <ETHBalance className="text-lg font-medium mt-2 " />
            </div>

            <div className="">
              <h3 className="text-xl font-medium  text-yellow-500 mb-2">
                Membership
              </h3>
              <Plaque
                membership={
                  userData?.membership ? userData?.membership : "free"
                }
              />
            </div>
            {!userData || userData?.membership === "free" ? (
              <div>
                <button
                  type="button"
                  onClick={() => setOpenModal(true)}
                  className=" hover:animate-pulse mt-3 mb-1 bg-transparent hover:bg-red-600 text-yellow-400 font-bold hover:text-black py-2 px-4 border-2 border-red-600 hover:border-transparent rounded">
                  Go Pro
                </button>
                <Pro isOpen={openModal} setIsOpen={setOpenModal} />
              </div>
            ) : // <div className="grid grid-flow-col border-2 w-3/4 mx-auto">
            //Buttons here to set chart intervals, etc.
            // </div>
            null}
          </div>
        </div>
      </div>
      {/* </Transition> */}
    </>
  );
};

export default Account;
