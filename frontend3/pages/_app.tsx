import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import { DataProvider } from "../contexts/DataContext";
import { AccountProvider } from "../contexts/AccountContext";

import "../styles/globals.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
export default function NextWeb3App({
  Component,
  pageProps,
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <MoralisProvider
      appId="JoWO28LE3kEDAVWhkaVLoxA8wRGnB5RMTdsJaZ8A"
      serverUrl="https://aioslfluudst.usemoralis.com:2053/server">
      <AccountProvider>
        <DataProvider>
          <Component {...pageProps} />
        </DataProvider>
      </AccountProvider>
    </MoralisProvider>
  );
}
