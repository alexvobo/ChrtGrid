import type { Web3Provider } from "@ethersproject/providers";
import { useMoralis } from "react-moralis";
import useSWR from "swr";

function getBlockNumber(library: Web3Provider) {
  return async () => {
    return library.getBlockNumber();
  };
}

export default function useBlockNumber() {
  const { web3 } = useMoralis();

  const library = web3;
  const shouldFetch = !!library;

  return useSWR(shouldFetch ? ["BlockNumber"] : null, getBlockNumber(library), {
    refreshInterval: 10 * 1000,
  });
}
