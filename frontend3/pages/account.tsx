import Layout from "../components/Layout";

export default function Account() {
  return <div></div>;
}

Account.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
