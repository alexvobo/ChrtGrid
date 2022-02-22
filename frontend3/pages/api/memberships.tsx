import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  const { query: params } = req;

  try {
    const { db } = await connectToDatabase();

    const memberships = await db.collection("membership").find({}).toArray();

    if (!memberships) {
      throw new Error("Error finding membership max count");
    }
    // console.log(memberships);
    return res.status(200).json({
      message: "Membership count obtained successfully",
      memberships: memberships,
    });
  } catch (error) {
    return res.status(404).json({
      error: "DB Error",
      message: "Could not return membership information",
    });
  }
}
