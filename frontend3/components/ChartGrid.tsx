import { useState, useEffect } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import LoadingIcons from "react-loading-icons";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";

import useInterval from "../hooks/useInterval";
import Toggle from "./Toggle";

function reloadPage() {
  window.location.reload();
}

export default function ChartGrid({ exchange, market, maxCharts }) {
  const router = useRouter();
  const { data, error } = useSWRImmutable(`/api/${exchange}/${market}/coins`);
  const [refresh, setRefresh] = useState(false);

  useInterval(() => {
    // Every 15 min, reload page to refresh all TradingView charts at once if refresh is enabled
    if (refresh === true) reloadPage();
  }, 1000 * 60 * 15);

  if (!data || error)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcons.Bars height="5em" fill="white" speed={0.75} />
      </div>
    );

  return (
    <>
      {console.log(data)}
      <div className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 grid-cols-3 ">
        {data.map(
          (item, i) =>
            i < maxCharts && (
              <div
                className="h-[300px] border-2 border-yellow-600 w-full overflow-hidden"
                key={i}>
                {/* <AdvancedRealTimeChart
                symbol={item}
                  theme="dark"
                  hide_side_toolbar={true}
                hide_legend={true}
                interval="120"
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
