import Layout from "../components/layout";

export default function Account() {
  return <div></div>;
}

Account.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
