import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const address = req.body["account"];

    if (!address) {
      return res.status(400).json({ error: "metamask error" });
    }
    try {
      const { db } = await connectToDatabase();

      var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const user = await db.collection("users").update(
        { _id: address },
        {
          $set: { last_seen: Date.now(), last_ip: ip },
          $setOnInsert: {
            _id: address,
            joined: Date.now(),
            joined_ip: ip,
            tier: "free",
            payment_history: [],
          },
        },
        { upsert: true }
      );

      return res.status(200).json({ message: "User Updated" });
    } catch (error) {
      console.log("here", error);
      return res.status(404).json({ error: "Failed to connect to DB" });
    }
  }
  return res.status(400).json({ message: "Invalid method." });
}
