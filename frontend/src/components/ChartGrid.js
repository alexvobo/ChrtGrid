import React, { useMemo, useState } from "react";

import TradingViewWidget, { Themes } from "react-tradingview-widget";

export default function ChartGrid({ data }) {
  return (
    <>
      <div
        className="grid xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 grid-cols-3 "
        cols={4}>
        {data.map((item, i) => (
          <div key={i}>
            <div className="boxxy2 h-100 w-100">
              {item}
              <div className="h-[300px]  w-full bg-blue-900"></div>
            </div>

            {/* <div className=" h-[300px]  w-full">
              <TradingViewWidget
                symbol={item}
                theme={Themes.DARK}
                hide_legend={true}
                interval={120}
                autosize
                withdateranges={true}
              />
            </div> */}
          </div>
        ))}
      </div>
    </>
  );
}
