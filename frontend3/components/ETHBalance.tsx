import { useMoralis, useChain } from "react-moralis";
import useETHBalance from "../hooks/useETHBalance";

import { parseBalance } from "../util";
import { useData } from "../contexts/DataContext";

type ETHBalanceProps = {
  className: string;
};
//Formats the user's native ERC-20 balance and finds the currency logo from the networks prop.
const ETHBalance = ({ className }) => {
  const { account } = useMoralis();
  const { chain } = useChain();
  const { data } = useETHBalance(account);
  const { networks } = useData();
  return (
    <div className={className}>
      <div className="mr-1 inline ">{parseBalance(data ?? 0)}</div>
      <div className="inline">
        {networks?.find((network) => network.chainID === chain?.chainId)
          ?.currencyLogo ?? ""}
      </div>
    </div>
  );
};

export default ETHBalance;
