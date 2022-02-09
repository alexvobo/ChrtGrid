import type { ReactElement, ReactNode } from 'react'
import { Web3ReactProvider } from "@web3-react/core";
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import getLibrary from "../getLibrary";
import "../styles/globals.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
export default function NextWeb3App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
     getLayout(<Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>)
  );
}


