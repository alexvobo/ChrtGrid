import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { ArrowCircleUpIcon } from "@heroicons/react/outline";
import LoadingIcons from "react-loading-icons";
import { useData } from "../contexts/DataContext";
import { useAccount } from "../contexts/AccountContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
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
  const { coins, exchange, market } = useData();
  const { maxCharts } = useAccount(); //this is prob triggering a rerender on refocus

  const [interval, setInterval] = useLocalStorage("interval", "120");

  if (
    coins === undefined ||
    !coins ||
    !coins.length ||
    !exchange ||
    !maxCharts ||
    !interval
  ) {
    return (
      <div className="relative flex justify-center items-center h-screen text-white">
        {market === "custom" && coins.length === 0 ? (
          <div className="">
            <span className="text-white invisible md:visible absolute top-4 left-40 2xl:left-[300px] animate-bounce ">
              <ArrowCircleUpIcon className=" h-12 w-12 " />
            </span>
            <span className="text-3xl animate-pulse">Please Add Coins</span>
          </div>
        ) : (
          <LoadingIcons.Bars height="5em" fill="white" speed={0.75} />
        )}
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
                {/* <div className="text-white">
                  {item} {interval}
                </div> */}
                {/* <AdvancedRealTimeChart
                  symbol={item}
                  show_popup_button={true}
                  theme="dark"
                  hide_side_toolbar={true}
                  hide_legend={true}
                  interval={interval}
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
