import Layout from "../components/Layout";
import { HeartIcon } from "@heroicons/react/solid";
const QA = [
  {
    question: "Why does it take so long between selecting options?",
    answers: [
      "Due to the way Tradingview widgets work, there needs to be a cooldown period or you will get IP throttled after too many requests.",
    ],
  },
  {
    question: "Ok I get that, but why aren't my charts loading :(",
    answers: [
      "Please give it 10-30 seconds and refresh if you see half-filled circles or a blank chart, or clear your cookies and try again.",
    ],
  },
  {
    question: "Wen giveaway?",
    answers: [
      <span key={0}>
        We will be doing up to <span className="font-semibold">FOUR</span>{" "}
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
        Dafuq is <span className="animate-pulse text-pink-500">LIFETIME</span>??
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
    question: "And what's a 'whitelist'?",
    answers: [
      <span key={3}>
        We are whitelisting our{" "}
        <span className="text-yellow-400">LIFETIME</span> members for premium
        features, giveaways, and more
      </span>,
      <span key={4}>
        If you are a <span className="text-yellow-400">LIFETIME</span> member,
        you may receive tokens later on as a license for your subscription,
        allowing transferability 😮
      </span>,
    ],
  },
  {
    question: "Weird error on page with code (oops) or other bugs",
    answers: [
      <a
        className=""
        href="https://twitter.com/chrtGrid"
        target="_blank"
        rel="noreferrer"
        key={5}>
        Twitter:{" "}
        <span className="hover:underline text-blue-500"> @chrtGrid</span>
      </a>,
      <a key={6} href="mailto:support@gridly.xyz">
        Email:{" "}
        <span className="text-blue-500 hover:underline">
          support@gridly.xyz
        </span>{" "}
        with #[Bug Report] in the subject line
      </a>,
    ],
  },
  {
    question: "Wen new features coming ser?",
    answers: [
      "We are actively working on developing new free & premium features for the platform. There are some underway already.",
    ],
  },

  {
    question: "What do you do with my money?",
    answers: [
      "Payments for services offered by chrtGrid go towards improving the product and keeping the lights on.",
      "Servers aren't cheap, and everything is built in-house. We really appreciate you 💖",
    ],
  },
];
export default function Help() {
  return (
    <div className=" border-2 border-pink-800/80 shadow-md shadow-pink-800 w-2/3 mt-4 rounded mx-auto p-4">
      {" "}
      <div className="text-center  text-blue-500 text-5xl mt-4 mb-12">
        help bls
      </div>
      <div className="px-8 mb-4 mx-auto">
        <ul>
          {QA?.map((x, xi) => (
            <li key={xi}>
              <h1 className=" text-yellow-500 text-2xl">
                &#9783; {x.question}
              </h1>
              <div className="ml-4">
                {x?.answers?.map((y, yi) => (
                  <div key={yi}>
                    <span className="text-2xl text-pink-500 ">&#10161;</span>
                    <p className="ml-2 font-medium  inline text-gray-300 text-lg">
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
