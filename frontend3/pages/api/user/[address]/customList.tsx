import { connectToDatabase } from "../../../../lib/mongodb";

export default async function handler(req, res) {
  const { query: account } = req;
  const address = account["address"]?.toLowerCase();

  if (!address) {
    return res.status(400).json({ error: "Data error" });
  }

  try {
    const { db } = await connectToDatabase();

    const user = await db
      .collection("users")
      .find({ _id: address })
      .project({ customList: 1 })
      .toArray();
    return res.status(200).json(user[0]);
  } catch (error) {
    return res.status(404).json({ error: "Failed to get custom list from DB" });
  }
}
