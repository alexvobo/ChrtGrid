import Navbar from "./navbar";
import Footer from "./footer";
import MetamaskProvider from "./MetamaskProvider";
import { SWRConfig } from "swr";
import fetch from "../lib/fetch.js";

export default function Layout({ children }) {
  return (
    <>
      <SWRConfig
        value={{
          fetcher: fetch,
        }}>
        <MetamaskProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </MetamaskProvider>
      </SWRConfig>
    </>
  );
}
