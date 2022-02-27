import React, { useState, useEffect } from "react";
import { useWeb3Transfer, useMoralis, useChain } from "react-moralis";
import axios from "axios";
import { toast } from "react-toastify";

import useETHBalance from "../hooks/useETHBalance";
import { parseBalance } from "../util";
import { useData } from "../contexts/DataContext";
import { useAccount } from "../contexts/AccountContext";
type PaymentData = {
  amount: string;
  receiver: string;
  tier: string;
};
export default function Pay({ amount, receiver, tier, modalController }) {
  const { account, Moralis } = useMoralis();
  const { chain } = useChain();
  const { data } = useETHBalance(account);
  const { networks } = useData();
  const { mutateUser } = useAccount();
  const [balance, setBalance] = useState(0);
  const [clickedPay, setClickedPay] = useState(false);
  const { fetch, error, isFetching } = useWeb3Transfer({
    amount: Moralis.Units.ETH(amount),
    receiver: receiver,
    type: "native",
  });
  useEffect(() => {
    if (data) {
      setBalance(parseFloat(parseBalance(data ?? 0)));
    }
  }, [chain, data]);

  async function payNow() {
    //Get payment data from DB, then create transaction
    try {
      setClickedPay(true);
      const id = toast.loading("Processing Payment...", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      fetch({
        throwOnError: false,
        onComplete: () => {
          if (error) {
            toast.update(id, {
              render: "Error",
              type: "error",
              isLoading: false,
            });
            console.log(error);
          }
        },
        onSuccess: async (receipt) => {
          // console.log(receipt);

          try {
            const res = await axios.post(
              `api/user/${account}/payment`,
              "body",
              {
                params: {
                  receipt,
                  tier: tier.toLowerCase(),
                  network: chain.chainId.toLowerCase(),
                },
              }
            );
            // console.log(res.data);
            if (res.status === 200) {
              toast.update(id, {
                render: (
                  <span>
                    Payment Successful.
                    <br /> Thank you!
                  </span>
                ),
                type: "success",
                isLoading: false,
              });
              mutateUser();
              modalController(false);
            } else {
              toast.update(id, {
                render: "Failed to Update Database",
                type: "error",
                isLoading: false,
              });
            }
          } catch (error) {
            toast.update(id, {
              render: "Error",
              type: "error",
              isLoading: false,
            });
            console.log(error);
          }

          // window.location.reload();
        },
        onError: () => {
          //Throw error
          toast.update(id, {
            render: "Payment Error",
            type: "error",
            isLoading: false,
          });
          console.log(error);

          // toast("error");
        },
      });
      setClickedPay(false);
    } catch (error) {
      console.log(error);
    }
  }

  return balance < parseFloat(amount) ? (
    <a href="https://www.coinbase.com" target="_blank" rel="noreferrer">
      <button
        type="button"
        className=" px-4 py-2 text-lg font-bold text-black bg-yellow-500 border border-transparent rounded-md hover:bg-transparent hover:border hover:border-yellow-500 hover:text-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
        <span>Need {parseFloat(amount) - balance} more </span>
        <span>
          {networks?.find((n) => n?.chainID === chain?.chainId)?.currencyName}
        </span>
      </button>
    </a>
  ) : (
    <button
      type="button"
      className={`px-4 py-2 text-lg font-bold text-black bg-yellow-500 border border-transparent rounded-md hover:bg-transparent hover:border hover:border-yellow-500 hover:text-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
        clickedPay ? "invisible" : null
      }`}
      disabled={isFetching}
      onClick={payNow}>
      Buy Now
    </button>
  );
}
