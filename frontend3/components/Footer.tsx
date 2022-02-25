import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "@heroicons/react/solid";

export default function Footer() {
  return (
    <div className=" mt-4 mb-4 pt-7 grid grid-flow-col relative border-t-2 border-yellow-600 font-medium text-sm md:text-lg ">
      <div className="mx-auto  text-center text-white  ">
        <div className="flex mb-1">
          <Image
            src="/twitter.png"
            className=""
            height={20}
            width={24}
            alt="Twitter"
          />
          <a
            className="hover:underline   text-yellow-500  "
            href="https://twitter.com/ChrtGrid"
            target="_blank"
            rel="noreferrer">
            @chrtGrid
          </a>
        </div>
        <div className="flex ">
          <Image
            src="/telegram.svg"
            className=""
            height={20}
            width={24}
            alt="Twitter"
          />
          <a
            className="hover:underline   text-yellow-500  "
            href="https://t.me/chrtGrid"
            target="_blank"
            rel="noreferrer">
            @chrtGrid
          </a>
        </div>
      </div>
      <div className="m-auto text-center text-white  mb-4  ">
        <Link href="/contact">
          <a className="hover:underline  text-yellow-500">Contact Us</a>
        </Link>{" "}
        |{" "}
        <Link href="/help">
          <a className="hover:underline text-yellow-500">FAQ</a>
        </Link>{" "}
        |{" "}
        <Link href="/terms">
          <a className="hover:underline text-yellow-500">ToS</a>
        </Link>
      </div>
      <div className="mx-auto text-center text-white  mt-2 ">
        Made with{" "}
        <HeartIcon className="animate-pulse text-pink-500 inline mb-1 h-5 w-5" />
      </div>
    </div>
  );
}
