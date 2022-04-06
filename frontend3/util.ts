import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";

export function titleCase(str: string) {
  let formattedString = str.toLowerCase().split(" ");
  for (var i = 0; i < formattedString.length; i++) {
    formattedString[i] =
      formattedString[i].charAt(0).toUpperCase() + formattedString[i].slice(1);
  }
  return formattedString.join(" ");
}

export function shortenHex(hex: string, length = 4) {
  return `${hex?.substring(0, length + 2)}…${hex?.substring(
    hex.length - length
  )}`;
}

const ETHERSCAN_PREFIXES = {
  "0x1": "etherscan.io",
  "0xa86a": "snowtrace.io",
  "0xa869": "testnet.snowtrace.io",
};

export function formatEtherscanLink(
  type: "Account" | "Transaction",
  data: [number | string, string]
) {
  switch (type) {
    case "Account": {
      const [chainId, address] = data;
      return `https://${ETHERSCAN_PREFIXES[chainId]}/address/${address}`;
    }
    case "Transaction": {
      const [chainId, hash] = data;
      return `https://${ETHERSCAN_PREFIXES[chainId]}/tx/${hash}`;
    }
  }
}

export const parseBalance = (
  value: BigNumberish,
  decimals = 18,
  decimalsToDisplay = 3
) => parseFloat(formatUnits(value, decimals)).toFixed(decimalsToDisplay);
