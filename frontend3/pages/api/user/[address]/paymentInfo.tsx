import { connectToDatabase } from "../../../../lib/mongodb";

export default async function handler(req, res) {
  const { query: params } = req;

  // console.log("In payment/get, ", params);

  const network = params["network"].toLowerCase();
  const tier = params["tier"].toLowerCase();

  if (network === "" || !network || !tier || tier === "") {
    return res.status(400).json({
      error: "Error with parameters",
      message: "Try again",
    });
  }

  try {
    const { db } = await connectToDatabase();

    const proMembership = await db
      .collection("membership")
      .find({ tier: tier.toLowerCase(), network: network.toLowerCase() })
      .toArray();

    if (!proMembership) {
      throw new Error("Error finding membership details");
    }

    const paymentTier = proMembership[0]["tier"];
    const paymentAddress = proMembership[0]["payment_address"];
    const paymentAmount = proMembership[0]["cost"];

    return res.status(200).json({
      message: "Obtained payment parameters successfully",
      payment_tier: paymentTier,
      payment_to: paymentAddress,
      payment_amount: paymentAmount,
      network: network,
    });
  } catch (error) {
    return res.status(404).json({
      error: "DB Error",
      message: "Could not return payment information",
    });
  }
}
