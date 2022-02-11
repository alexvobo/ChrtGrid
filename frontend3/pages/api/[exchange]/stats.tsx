import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  const {
    query: { exchange, market },
  } = req;

  const { db } = await connectToDatabase();
  const stats = await db
    .collection(exchange)
    .find({ market: "stats" })
    .toArray();

  return res.status(200).json(stats[0]["stats"]);
}
