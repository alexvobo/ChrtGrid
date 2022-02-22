import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  const { query: params } = req;

  const tier = params["tier"].toLowerCase();

  if (tier === "" || !tier) {
    return res.status(400).json({
      error: "Error with parameters",
      message: "Try again",
    });
  }

  try {
    const { db } = await connectToDatabase();

    const membershipCount = await db
      .collection("users")
      .find({ membership: tier })
      .toArray();

    if (membershipCount === undefined) {
      throw new Error("Error finding membership details");
    }
    const membershipMax = await db
      .collection("membership")
      .find({ tier: tier })
      .toArray();

    if (!membershipMax) {
      throw new Error("Error finding membership max count");
    }

    return res.status(200).json({
      message: "Membership count obtained successfully",
      tier: tier,
      count: membershipCount.length,
      max: membershipMax[0]["max"],
    });
  } catch (error) {
    return res.status(404).json({
      error: "DB Error",
      message: "Could not return membership information",
    });
  }
}
