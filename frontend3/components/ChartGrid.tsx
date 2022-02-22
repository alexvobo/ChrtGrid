import { useState, useEffect, useContext } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import LoadingIcons from "react-loading-icons";
import { useData } from "../contexts/DataContext";
import { useAccount } from "../contexts/AccountContext";
// import useInterval from "../hooks/useInterval";

function reloadPage() {
  window.location.reload();
}
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
  const [refresh, setRefresh] = useState(false);

  // useInterval(() => {
  //   // Every 15 min, reload page to refresh all TradingView charts at once if refresh is enabled
  //   if (refresh === true) reloadPage();
  // }, 1000 * 60 * 15);
  console.log(maxCharts);
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
      <div
        className={`grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 grid-cols-3 `}>
        {coins?.map(
          (item, i) =>
            i < maxCharts && (
              <div
                className={
                  `h-[300px] border-2 w-full overflow-hidden ` +
                  exchangeThemes[exchange]["gridColor"]
                }
                key={i}>
                <div className="text-white">{item}</div>
                {/* <AdvancedRealTimeChart
                    symbol={item}
                    theme="dark"
                    hide_side_toolbar={true}
                    hide_legend={true}
                    interval="240"
                    autosize
                    withdateranges={true}
                  /> */}
              </div>
            )
        )}
      </div>
    </>
  );
}
// serversideprops: ({ exchange, market, maxCharts }) => {};
