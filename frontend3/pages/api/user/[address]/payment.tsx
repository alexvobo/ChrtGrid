import { connectToDatabase } from "../../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { parseBalance } from "../../../../util";

const MORALIS_API_KEY = process.env.MORALIS_API;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query: params } = req;
  // console.log(params);

  const receipt = JSON.parse(params["receipt"] as string);
  const network = params["network"] as string;
  const tier = params["tier"] as string;

  if (!receipt || !tier || !network) {
    return res.status(400).json({
      error: "Parameter Error",
      message: "Please provide all the required parameters",
      receipt: receipt,
      network: network,
      tier: tier,
    });
  }

  let db_membership_data = {};
  try {
    const { db } = await connectToDatabase();

    //Fetches membership data for requested tier first from the DB.
    const membership = await db
      .collection("membership")
      .find({ tier: tier.toLowerCase(), network: network.toLowerCase() })
      .toArray();

    db_membership_data["paymentAddress"] = membership[0]["payment_address"];
    db_membership_data["paymentAmount"] = membership[0]["cost"];
    db_membership_data["paymentNetwork"] = membership[0]["network"];
    db_membership_data["subscriptionPeriod"] = parseInt(
      membership[0]["subscription_period"]
    );

    // console.log(db_membership_data);

    //make sure tx isnt trying to scam us by being unequal to database data
    if (
      db_membership_data["paymentAddress"] !== receipt["to"] ||
      db_membership_data["paymentNetwork"] !== network ||
      parseFloat(parseBalance(receipt["value"]["hex"])) <
        db_membership_data["paymentAmount"]
    ) {
      throw new Error("Data mismatch");
    }

    // console.log("Verifying with Moralis");

    // We verified that the data submitted was the same as in the database
    // now verify that the transaction was successful

    // const tx = await Moralis.Web3API.native.getTransaction({
    //   chain: "0xa869",
    //   transaction_hash: transactionHash,
    // });
    // console.log("adding to db");

    const date = new Date();
    const subscriptionEnds = date.setDate(
      date.getDate() + db_membership_data["subscriptionPeriod"]
    );

    const payment_receipt = {
      tier: tier,
      chain_used: network,
      payment_amount: parseBalance(receipt["value"]["hex"]),
      payment_from: receipt["from"].toLowerCase(),
      payment_to: receipt["to"].toLowerCase(),
      transaction_hash: receipt["hash"],
      subscription_started: Date.now(),
      subscription_ends: subscriptionEnds,
    };

    // add payment to user's payment history
    const log_payment = await db.collection("users").update(
      { _id: receipt["from"].toLowerCase() },
      {
        $set: {
          subscription_ends: subscriptionEnds,
          membership: tier,
        },
        $push: { payment_history: payment_receipt },
      },
      { upsert: true }
    );
    return res.status(200).json({
      message: `Membership for ${receipt["from"]} updated to ${tier}`,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Payment Error",
      message: "Invalid amount / wrong address / bad transaction hash",
      address: receipt["from"],
      network: network,
      payment_amount: parseBalance(receipt["value"]["hex"]),
      payment_to: receipt["to"],
      transaction_hash: receipt["hash"],
    });
  }
}
