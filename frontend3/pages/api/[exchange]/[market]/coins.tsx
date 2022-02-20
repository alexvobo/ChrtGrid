import { connectToDatabase } from "../../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const {
      query: { exchange, market },
    } = req;

    console.log(exchange, market);
    if (exchange === "" || !exchange || !market || market === "") {
      return res.status(400).json({
        error: "Error with parameters",
        message: "Try again",
      });
    }

    const { db } = await connectToDatabase();
    const coins = await db
      .collection(exchange)
      .find({ market: market })
      .toArray();
    const data = coins[0]["coins"];
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load coins" });
  }
}
