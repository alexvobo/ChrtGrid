import React from "react";

export default function ConnectWallet({ connectWalletHandler }) {
  return (
    <button
      onClick={connectWalletHandler}
      className="h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold mb-2 px-4 rounded">
      Connect Wallet
    </button>
  );
}
