import { useEffect } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import LoadingIcons from "react-loading-icons";
import { useData } from "../contexts/DataContext";
import { useAccount } from "../contexts/AccountContext";

const exchangeThemes = {
  coinbase: {
    gridColor: "border-blue-600 ",
  },
  kucoin: {
    gridColor: "border-[#23af91] ",
  },
  binance: {
    gridColor: "border-yellow-500 ",
  },
};
export default function ChartGrid() {
  const { coins, exchange } = useData();
  const { maxCharts } = useAccount();
  // useEffect(() => {
  //   console.log(coins);
  // }, [coins]);

  if (
    coins === undefined ||
    !coins ||
    !coins.length ||
    !exchange ||
    !maxCharts
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcons.Bars height="5em" fill="white" speed={0.75} />
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-2  md:grid-cols-3 ">
        {coins?.map(
          (item, i) =>
            i < maxCharts && (
              <div
                className={`h-[320px] border w-full overflow-hidden ${exchangeThemes[exchange]["gridColor"]}`}
                key={i}>
                {/* <div className="text-white">{item}</div> */}
                <AdvancedRealTimeChart
                  symbol={item}
                  theme="dark"
                  hide_side_toolbar={true}
                  hide_legend={true}
                  interval="240"
                  autosize
                  withdateranges={true}
                />
              </div>
            )
        )}
      </div>
    </>
  );
}
