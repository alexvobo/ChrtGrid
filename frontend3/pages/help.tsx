import Layout from "../components/Layout";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/solid";
const QA = [
  {
    question: "Why does it take so long between exchange/option selection?",
    answers: [
      "Due to the way Tradingview widgets work, there needs to be a cooldown period or you will get IP throttled after too many requests.",
    ],
  },
  {
    question: "Ok I get that, why aren't my charts loading :(",
    answers: [
      "Please give it 10-30 seconds and refresh if you see half-filled circles or a blank chart, or clear your cookies and try again.",
    ],
  },
  {
    question: "Wen giveaway?",
    answers: [
      <span key={0}>
        We will be doing up to <span className="font-semibold">5</span>{" "}
        <span className="font-bold text-pink-500">PREMIUM</span> NFT (tubby
        cats, cryptoadz, etc.) giveaways for{" "}
        <span className="font-bold text-yellow-400 underline animate-pulse">
          LIFETIME
        </span>{" "}
        members.
      </span>,
      "Please check our twitter for more information.",
    ],
  },

  {
    question: (
      <span key={1}>
        What is{" "}
        <span className="animate-pulse font-semibold text-pink-500">
          LIFETIME
        </span>
        ??
      </span>
    ),
    answers: [
      "We are offering a promotion for early adopters that replaces our 'Pro' tier (a monthly plan).",
      <span key={2}>
        Early supporters will get a perpetual subscription so long as our
        servers stay running, plus{" "}
        <span className=" font-bold text-white">many</span> other benefits.
      </span>,
      "This means you do not have to pay ever again to access our premium features from the same address (no exceptions).",
    ],
  },
  {
    question: "Wym 'whitelist'?",
    answers: [
      <span key={3}>
        We are whitelisting our{" "}
        <span className="text-yellow-400">LIFETIME</span> members for premium
        features, giveaways, and more
      </span>,
      <span key={4}>
        If you are a <span className="text-yellow-400">LIFETIME</span> member,
        you may receive tokens or an NFT later on as a license for your
        subscription, allowing transferability 😮
      </span>,
    ],
  },
  {
    question: "Weird error on page with code (oops) or other bugs",
    answers: [
      <span key={5}>
        Please{" "}
        <Link href="/contact">
          <a>
            <span className="hover:underline text-blue-500">Contact Us</span>
          </a>
        </Link>{" "}
        via form. Thanks!
      </span>,
    ],
  },
  {
    question: "Wen new features ser?",
    answers: [
      "We are actively working on developing new free & premium features for the platform.",
    ],
  },

  {
    question: "What do you do with my money?",
    answers: [
      "Payments for services offered by chrtGrid go towards improving the product and keeping the lights on.",
      <span key={6}>
        Servers aren&apos;t cheap and everything is built in-house. We really
        appreciate you <span className="animate-pulse text-2xl">💖</span>
      </span>,
    ],
  },
];
export default function Help() {
  return (
    <div className=" border-2 border-pink-800/80 shadow-md shadow-pink-800 w-full  xl:w-3/5 mt-4 rounded mx-auto p-4">
      {" "}
      <div className="text-center  text-blue-500 text-5xl mt-4 mb-12">
        Help Bls
      </div>
      <div className="px-8 mb-4 mx-auto">
        <ul>
          {QA?.map((x, xi) => (
            <li key={xi}>
              <h1 className=" text-yellow-500 text-2xl  mt-4">
                &#9783; {x.question}
              </h1>
              <div className="ml-4">
                {x?.answers?.map((y, yi) => (
                  <div className="" key={yi}>
                    <span className="text-2xl text-pink-500 ">&#10161;</span>
                    <p className=" ml-2 font-medium  inline text-gray-300 text-lg">
                      {y}
                    </p>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Help.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
