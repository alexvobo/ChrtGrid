import Layout from "../components/layout";

export default function Bot() {
  return <div></div>;
}

Bot.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
