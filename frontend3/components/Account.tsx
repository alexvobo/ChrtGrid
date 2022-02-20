import { useEffect, useState } from "react";
import { ExternalLinkIcon } from "@heroicons/react/outline";

import ETHBalance from "../components/ETHBalance";
import Pro from "./Pro";

import useENSName from "../hooks/useENSName";
import { useMoralis } from "react-moralis";

import { formatEtherscanLink, shortenHex, titleCase } from "../util";

const Account = () => {
  // manage connecting state for injected connector

  const { account, chainId } = useMoralis();

  const ENSName = useENSName(account);

  const [userData, setUserData] = useState(null);
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
      fetch("/api/user/" + account)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          console.log(data);
        })
        .catch((err) => {});
    }
  }, [account]);

  if (!account) {
    return null;
  }

  return (
    <div className="text-white mb-5">
      <div className="inline-block w-full max-w-md  p-2  overflow-hidden align-middle transition-all transform bg-transparent rounded border-2 border-indigo-600 shadow-md shadow-indigo-500 ">
        <div className="grid grid-rows-4 text-center mb-3  gap-3">
          <div className="">
            <h3 className="text-xl font-medium  text-yellow-500">Account</h3>
            <div className=" hover:bg-indigo-700  bg-indigo-800/80 w-3/5 mx-auto">
              <a
                className="text-lg"
                {...{
                  href: formatEtherscanLink("Account", [chainId, account]),
                  target: "_blank",
                  rel: "noopener noreferrer",
                }}>
                {ENSName || `${shortenHex(account, 4)}`}{" "}
                <span className=" border-l-2  border-yellow-600  text-center ml-2 ">
                  {" "}
                  <ExternalLinkIcon className=" inline h-5 w-5 mb-1 text-center ml-2" />
                </span>
              </a>{" "}
            </div>
          </div>
          <div className="">
            <h3 className="text-xl font-medium text-yellow-500">Balance</h3>

            <ETHBalance className="text-lg mt-2 " />
          </div>

          <div className="">
            <h3 className="text-xl font-medium  text-yellow-500">Membership</h3>
            <p className="text-lg">
              {userData ? titleCase(userData.membership) : "Free"}
            </p>
          </div>
          {!userData || userData.membership == "free" ? (
            <div>
              <button
                type="button"
                onClick={() => setOpenModal(true)}
                className="mt-3 mb-1 bg-transparent hover:bg-red-600 text-yellow-400 font-bold hover:text-black py-2 px-4 border-2 border-red-600 hover:border-transparent rounded">
                Go Pro
              </button>
              <Pro isOpen={openModal} setIsOpen={setOpenModal} />
            </div>
          ) : userData.membership == "pro" ||
            userData.membership == "lifetime" ? (
            <div className="grid grid-flow-col border-2 w-3/4 mx-auto">
              <p> Insert hook for chartsAmt</p>
              <p> Insert hook to enable refresh in chartgrid</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Account;
