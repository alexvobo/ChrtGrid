import React from "react";
import Image from "next/image";
import pbavax from "../public/poweredbyavax.svg";
export default function Footer() {
  return (
    <div className=" mt-4  relative border-t-2 border-yellow-600 ">
      <div className="mx-auto text-center text-white pt-5 mb-5  ">
        © 2022 Copyright
        <a
          className="text-yellow-500"
          href="https://chrtgrid.com/"
          target="_blank"
          rel="noreferrer">
          {" "}
          chrtGrid
        </a>
      </div>
    </div>
  );
}
