import { useMoralis } from "react-moralis";
import useETHBalance from "../hooks/useETHBalance";
import Image from "next/image";
import avax from "../public/avax.svg";
import { parseBalance } from "../util";

type ETHBalanceProps = {
  className: string;
};
const ETHBalance = ({ className }) => {
  const { account } = useMoralis();
  const { data } = useETHBalance(account);

  return (
    <div className={className}>
      <span className="mr-1 pb-">{parseBalance(data ?? 0)}</span>
      <Image className="" src={avax} height={17} width={17} alt="AVAX" />
    </div>
  );
};

export default ETHBalance;
