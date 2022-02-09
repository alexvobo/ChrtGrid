import Navbar from "./Navbar";
import Footer from "./Footer";
import { SWRConfig } from "swr";
import fetch from "../lib/fetch";

export default function Layout({ children }) {
  return (
    <>
      <SWRConfig
        value={{
          fetcher: fetch,
        }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </SWRConfig>
    </>
  );
}
