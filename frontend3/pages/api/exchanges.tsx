import { connectToDatabase } from "../../lib/mongodb";

export default async function exchanges (req,res) {
  try { 
    const { db } = await connectToDatabase();
    const exchanges = await db
        .listCollections()
        .toArray()
    res.status(200).json(exchanges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load stats' });
  }
};
