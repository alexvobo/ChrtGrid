import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import { DataProvider } from "../contexts/DataContext";
import { AccountProvider } from "../contexts/AccountContext";
import { ToastContainer } from "react-toastify";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

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
      appId={process.env.MORALIS_APPID}
      serverUrl={process.env.MORALIS_SERVERURL}>
      <AccountProvider>
        <DataProvider>
          <ToastContainer />
          <Component {...pageProps} />
        </DataProvider>
      </AccountProvider>
    </MoralisProvider>
  );
}
