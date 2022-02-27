import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import { DataProvider } from "../contexts/DataContext";
import { AccountProvider } from "../contexts/AccountContext";
import { ToastContainer } from "react-toastify";
import { DefaultSeo } from "next-seo";

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
    <>
      <MoralisProvider
        appId="JoWO28LE3kEDAVWhkaVLoxA8wRGnB5RMTdsJaZ8A"
        serverUrl="https://aioslfluudst.usemoralis.com:2053/server">
        <AccountProvider>
          <DataProvider>
            <ToastContainer />
            <DefaultSeo
              title="chrtGrid | Elevate Your Trading"
              description="The Ultimate Trading Companion"
              canonical="https://chrtgrid.com"
              additionalLinkTags={[
                {
                  rel: "icon",
                  href: "/favicon.ico",
                },
              ]}
              openGraph={{
                type: "website",
                locale: "en_US",
                description: "The Ultimate Trading Companion",
                images: [
                  {
                    url: "/GRID-NAV.png",
                    alt: "chrtGrid",
                    width: 400,
                    height: 300,
                  },
                ],
                url: "https://www.chrtgrid.com",
                site_name: "chrtGrid",
              }}
              twitter={{
                handle: "@chrtGrid",
                site: "@chrtGrid",
                cardType: "summary_large_image",
              }}
            />
            <Component {...pageProps} />
          </DataProvider>
        </AccountProvider>
      </MoralisProvider>
    </>
  );
}
