import type { Web3Provider } from "@ethersproject/providers";
import { useMoralis } from "react-moralis";
import useSWR from "swr";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";

function getETHBalance(library: Web3Provider) {
  return async (_: string, address: string) => {
    const balance = await library.getBalance(address);

    return balance;
  };
}

export default function useETHBalance(address: string, suspense = false) {
  const { chainId, web3 } = useMoralis();

  const shouldFetch = typeof address === "string" && !!web3;

  const result = useSWR(
    shouldFetch ? ["ETHBalance", address, chainId] : null,
    getETHBalance(web3),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
