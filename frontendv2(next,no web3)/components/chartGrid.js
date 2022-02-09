import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import LoadingIcons from "react-loading-icons";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function ChartGrid({ exchange, market, maxCharts }) {
  const router = useRouter();
  const { data, isValidating, error } = useSWR(`/api/${exchange}/${market}`, {
    refreshInterval: 1000 * 60 * 10,
  });

  // if (error) return <div>Failed to load users</div>;

  if (!data || error)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcons.Bars height="5em" fill="white" speed={0.75} />
      </div>
    );

  return (
    <>
      <div
        className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 grid-cols-3 "
        cols={4}>
        {console.log(data)}
        {data[0]["coins"].map(
          (item, i) =>
            i < maxCharts && (
              <div key={i}>
                <div className="border-2 h-100 w-100">
                  {item}
                  <div className="h-[300px]  w-full bg-blue-900"></div>
                </div>

                {/* <div className=" h-[300px]  w-full">
              <AdvancedRealTimeChart
                symbol={item}
                theme="dark"
                hide_legend={true}
                interval={120}
                autosize
                withdateranges={true}
              />
            </div> */}
              </div>
            )
        )}
      </div>
    </>
  );
}
