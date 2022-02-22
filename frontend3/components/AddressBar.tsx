import React from "react";
import { formatEtherscanLink, shortenHex } from "../util";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { ClipboardCopyIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddressBar({ account, chainId, ENSName, copyAddress }) {
  function copy(addr) {
    navigator.clipboard.writeText(addr);
    toast.dark("Copied to clipboard!", {
      position: "bottom-right",
    });
  }

  return (
    <div className=" hover:bg-blue-800  bg-blue-800/70 mx-auto px-7 hover:cursor-pointer rounded-sm ">
      <a
        onClick={() => (copyAddress ? copy(account) : null)}
        className="text-lg"
        {...{
          href: !copyAddress
            ? formatEtherscanLink("Account", [chainId, account])
            : null,
          target: !copyAddress ? "_blank" : null,
          rel: "noopener noreferrer",
        }}>
        {ENSName || `${shortenHex(account, 4)}`}{" "}
        <span className=" border-l-2  border-yellow-600  text-center ml-2 ">
          {" "}
          {copyAddress ? (
            <ClipboardCopyIcon className=" inline h-5 w-5 mb-1 text-center ml-2" />
          ) : (
            <ExternalLinkIcon className=" inline h-5 w-5 mb-1 text-center ml-2" />
          )}
        </span>
      </a>{" "}
    </div>
  );
}
