import Layout from "../components/Layout";
import { HeartIcon } from "@heroicons/react/solid";

const TERMS = [
  "We do not offer any financial services, nor do we offer any investment advice.",
  "We are not responsible for any loss you may incur as a result of using our platform, as we do not offer financial or investment services. This platform is purely for informational & educational purposes only, and any decision you make as a result of knowledge gained on this platform will be your own.",

  "LIFETIME memberships are valid as long as we can afford to keep the servers running",
  "No refunds will be given for any reason. No exceptions.",
];
export default function Terms() {
  return (
    <div className=" border-2 border-pink-800/80 shadow-md shadow-pink-800 w-1/2 mt-4 rounded mx-auto p-4">
      {" "}
      <div className="text-center  text-blue-500 text-5xl mt-4 mb-12">
        Terms of Service
      </div>
      <div className="px-8 mb-4 mx-auto ">
        <span className="text-yellow-400 font-bold text-xl">
          By using our platform (chrtGrid), you agree to the following terms:
        </span>
        <ul>
          {TERMS?.map((x, xi) => (
            <li key={xi}>
              <div className="ml-4">
                <div key={xi}>
                  <span className="text-2xl text-pink-500 ">&#10161;</span>
                  <p className="ml-2 font-medium  inline text-gray-300 text-lg">
                    {x}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Terms.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
