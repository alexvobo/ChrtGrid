import Navbar from "./Navbar";
import Footer from "./Footer";
import { SWRConfig } from "swr";

export default function Layout({ children }) {
  return (
    <>
        <Navbar />
        <main>{children}</main>
        <Footer />
    </>
  );
}
