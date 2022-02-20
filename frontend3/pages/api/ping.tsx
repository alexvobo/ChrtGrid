import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    //List all collections
    const collections = await db.listCollections().toArray();
    //If we have a list of collections, we are successfully connected
    if (collections && collections.length) {
      return res.status(200).json({ status: true });
    }
    throw new Error("Could not fetch collections");
  } catch (error) {
    return res.status(404).json({ error: "Failed to connect to DB" });
  }
}
