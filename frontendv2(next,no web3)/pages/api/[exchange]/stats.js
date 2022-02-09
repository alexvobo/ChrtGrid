import { connectToDatabase } from "../../../lib/mongodb";

export default async (req, res) => {
  const {
    query: { exchange, market },
  } = req;

  const { db } = await connectToDatabase();
  const coins = await db
    .collection(exchange)
    .find({ market: "stats" })
    .toArray();

  res.status(200).json(coins);
};
