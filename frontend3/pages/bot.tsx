import Layout from "../components/Layout";

export default function Bot() {
  return <div></div>;
}

Bot.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
