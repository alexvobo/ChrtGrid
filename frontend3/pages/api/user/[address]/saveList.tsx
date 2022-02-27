import { connectToDatabase } from "../../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const address = data?.address;
    const customList = data?.customList;

    if (!customList || !address) {
      return res.status(400).json({ status: "List error" });
    }
    try {
      const { db } = await connectToDatabase();

      //Fetches membership data for requested tier first from the DB.
      const user = await db
        .collection("users")
        .find({ _id: address })
        .toArray();

      if (user.length === 0) {
        return res.status(400).json({ status: "User not found" });
      } else {
        if (user[0].membership === "free") {
          return res.status(400).json({ status: "Not a premium member." });
        } else {
          const addList = await db.collection("users").update(
            { _id: address },
            {
              $set: { customList: customList },
            },
            { upsert: true }
          );
          return res.status(200).json({ status: "Saved" });
        }
      }
    } catch (error) {
      return res.status(500).json({ status: "Server error" });
    }
  }
  return res.status(500).json({ status: "POST only" });
}
