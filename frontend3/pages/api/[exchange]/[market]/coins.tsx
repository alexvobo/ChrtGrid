import { connectToDatabase } from "../../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const {
      query: { exchange, market },
    } = req;

    const { db } = await connectToDatabase();
    const coins = await db
      .collection(exchange)
      .find({ market: market })
      .toArray();

    return res.status(200).json(coins[0]["coins"]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load coins" });
  }
}
