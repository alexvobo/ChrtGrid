import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useState } from "react";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { injected } from "../connectors";

import useSWR from "swr";
import ETHBalance from "../components/ETHBalance";
import TokenBalance from "../components/TokenBalance";

import useENSName from "../hooks/useENSName";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";

import { formatEtherscanLink, shortenHex, titleCase } from "../util";

type AccountProps = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const GRID_TOKEN_ADDRESS = "";

  const { active, error, activate, chainId, account, setError } =
    useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  const ENSName = useENSName(account);

  useEffect(() => {
    if (typeof account === "string" && account.length > 0) {
      fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({ account }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Logged ", account);
      fetch("/api/user/" + account)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
          console.log(data);
        })
        .catch((err) => {});
    }
  }, [account]);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== "string") {
    return (
      <div className="text-center  mb-2">
        {isWeb3Available ? (
          <button
            className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-black py-2 px-4 border border-red-500 hover:border-transparent rounded "
            disabled={connecting}
            onClick={() => {
              setConnecting(true);

              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              });
            }}>
            {isMetaMaskInstalled ? "Connect to MetaMask" : "Connect to Wallet"}
          </button>
        ) : (
          <button onClick={startOnboarding}>Install Metamask</button>
        )}
      </div>
    );
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

            <ETHBalance className="text-lg" />
          </div>
          {/* <div className="">
            <h3 className="text-xl font-medium  text-yellow-500">
              Token Balance
            </h3>
            <TokenBalance
              tokenAddress={GRID_TOKEN_ADDRESS}
              symbol="GRID"
              className="text-lg"
            />
          </div> */}
          <div className="">
            <h3 className="text-xl font-medium  text-yellow-500">Membership</h3>
            <p className="text-lg">
              {userData ? titleCase(userData.membership) : "Free"}
            </p>
          </div>
          <div>
            {userData.membership == "free" && (
              <a
                href="https://traderjoexyz.com"
                target="_blank"
                rel="noreferrer">
                <button className="mt-3 mb-1 bg-transparent hover:bg-red-700 text-red-600 font-bold hover:text-black py-2 px-4 border-2 border-red-700 hover:border-transparent rounded">
                  Get Pro
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
