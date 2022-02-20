import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const {
      query: { exchange },
    } = req;
    if (exchange === "" || !exchange) {
      return res.status(400).json({
        error: "Error with parameters",
        message: "Try again",
      });
    }

    const { db } = await connectToDatabase();
    const stats = await db
      .collection(exchange)
      .find({ market: "stats" })
      .toArray();
    const data = stats[0]["stats"];
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to load stats" });
  }
}
