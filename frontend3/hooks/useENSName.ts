import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export default function useENSName(address: string) {
  const { web3, chainId } = useMoralis();
  const [ENSName, setENSName] = useState("");

  useEffect(() => {
    if (web3 && typeof address === "string") {
      let stale = false;

      web3
        .lookupAddress(address)
        .then((name) => {
          if (!stale && typeof name === "string") {
            setENSName(name);
          }
        })
        .catch(() => {});

      return () => {
        stale = true;
        setENSName("");
      };
    }
  }, [web3, address, chainId]);

  return ENSName;
}
