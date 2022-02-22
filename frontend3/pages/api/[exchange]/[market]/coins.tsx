import { connectToDatabase } from "../../../../lib/mongodb";
function shuffle(arr) {
  var j, x, index;
  for (index = arr.length - 1; index > 0; index--) {
    j = Math.floor(Math.random() * (index + 1));
    x = arr[index];
    arr[index] = arr[j];
    arr[j] = x;
  }
  return arr;
}
export default async function handler(req, res) {
  try {
    const {
      query: { exchange, market },
    } = req;

    if (exchange === "" || !exchange || !market || market === "") {
      return res.status(400).json({
        error: "Error with parameters",
        message: "Try again",
      });
    }

    const { db } = await connectToDatabase();
    if (market == "random") {
      const coins = await db
        .collection(exchange)
        .find({ market: "stats" })
        .toArray();
      const data = shuffle(coins[0]["coins"]);
      return res.status(200).json(data);
    } else {
      const coins = await db
        .collection(exchange)
        .find({ market: market })
        .toArray();
      const data = coins[0]["coins"];
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to load coins" });
  }
}
