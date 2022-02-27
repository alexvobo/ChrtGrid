import { Dialog, Transition } from "@headlessui/react";
import React, { useMemo, Fragment, useState, useEffect } from "react";
import LoadingIcons from "react-loading-icons";
import { toast } from "react-toastify";

import { useMoralis } from "react-moralis";
import MultiSelect from "./MultiSelect";
import { useAccount } from "../contexts/AccountContext";

export default function CustomList({ isOpen, setIsOpen }) {
  function closeModal() {
    setIsOpen(false);
  }

  const { account } = useMoralis();
  const { customListDB, userData } = useAccount();
  const [customList, setCustomList] = useState([]);
  const [clickedSave, setClickedSave] = useState(false);
  //pull this from api
  const [customItem, setCustomItem] = useState({
    exchange: "",
    symbol: "",
    pair: "",
  });
  const handleCustomItem = (e) => {
    const { name, value } = e.target;
    setCustomItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    console.log("saving");

    if (account) {
      setClickedSave(true);
      const id = toast.loading("Saving...", {
        theme: "dark",
        position: "top-right",

        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      const res = await fetch(`/api/user/${account}/saveList`, {
        method: "POST",
        body: JSON.stringify({
          address: account,
          customList: customList,
        }),
      });

      if (res.status === 200) {
        toast.update(id, {
          render: (
            <span>
              Saving Successful. <br />
              Click 'Custom Lists' to refresh.
            </span>
          ),
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(id, {
          render: "Failed to save. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
      setTimeout(() => {
        setClickedSave(false);
      }, 5000);
    }
    //toast stuff here
    //call api here

    //toast success or failure based on promise?
    //send new list to api to update the db
  };
  const handleAdd = (e) => {
    e.preventDefault();
    if (customList.length === 12) {
      toast.error("You can only have 12 items in your list", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      if (
        customItem.exchange.trim() === "" ||
        customItem.symbol.trim() === ""
      ) {
        toast.error("Please fill in all required fields", {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        //add item to list
        setCustomList([...customList, customItem]);
        //we only want to  reset the symbol in case the user wants to add more
        setCustomItem((prevState) => ({
          ...prevState,
          symbol: "",
        }));
      }
      console.log("adding");
    }
  };

  //   useEffect(() => {
  //     console.log(customList);
  //   }, [customList]);

  useEffect(() => {
    if (customListDB && customListDB !== undefined) {
      setCustomList(JSON.parse(JSON.stringify(customListDB)));
    }
  }, [userData, customListDB]);
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className=" fixed inset-0 z-10 overflow-y-auto bg-black/80"
          onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <div className="inline-block w-full xl:w-1/2 h-[620px] md:h-[550px] py-8 px-7 bg-slate-900/90 border-2 border-yellow-400/30  text-left align-middle transition-all transform  shadow-xl rounded-2xl">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="hover:bg-white/20 rounded-lg  text-center w-10 h-10 pb-1 absolute right-8 top-4 text-white text-2xl ">
                  &#10540;
                </button>

                <Dialog.Title
                  as="h3"
                  className="border-b-2 border-yellow-500 pb-4 text-3xl md:text-4xl text-center font-medium leading-6 text-white">
                  Custom List
                </Dialog.Title>

                <div className="text-center  grid grid-flow-row md:grid-flow-col">
                  <div className=" text-white mx-auto text-center  w-full grid grid-flow-row  py-4">
                    <form onSubmit={handleAdd}>
                      {/* lhs stuff here */}
                      <label
                        htmlFor="exchange"
                        className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-md font-medium text-gray-200">
                        Exchange/Source
                      </label>
                      <input
                        type="text"
                        name="exchange"
                        onChange={handleCustomItem}
                        value={customItem.exchange}
                        required
                        placeholder="COINBASE, TVC, ..."
                        className="bg-text-blue-400 border-2 p-2 border-pink-600 bg-transparent mt-1 focus:ring-blue-700 focus:border-blue-700 w-full md:w-2/3  shadow-sm sm:text-sm  rounded-md"
                      />
                      <label
                        htmlFor="symbol"
                        className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-md font-medium text-gray-200">
                        Symbol
                      </label>
                      <input
                        type="text"
                        name="symbol"
                        onChange={handleCustomItem}
                        value={customItem.symbol}
                        required
                        placeholder="BTC, USOIL, GOLD, ..."
                        className="bg-text-blue-400 border-2 p-2 border-orange-500 bg-transparent mt-1 focus:ring-blue-700 focus:border-blue-700 w-full md:w-2/3  shadow-sm sm:text-sm  rounded-md"
                      />
                      <label
                        htmlFor="pair"
                        className=" block text-md font-medium text-gray-200">
                        Pair
                      </label>
                      <input
                        type="text"
                        name="pair"
                        onChange={handleCustomItem}
                        value={customItem.pair}
                        placeholder="USD"
                        className="bg-text-blue-400 border-2 p-2 border-green-500 bg-transparent mt-1 focus:ring-blue-700 focus:border-blue-700 w-full md:w-2/3  shadow-sm sm:text-sm  rounded-md"
                      />
                      <div className="flex md:block mt-2 ">
                        <div className=" bg-purple-800/40 rounded-md py-2 shadow-inner mt-2  mx-auto w-2/3  ">
                          <h1 className="">Example</h1>
                          <div className="font-medium">
                            <ul>
                              <li>
                                <span className="text-pink-600">COINBASE</span>:
                                <span className="text-orange-500">BTC</span>
                                <span className="text-green-500">USD</span>
                              </li>
                              <li>
                                <span className="text-pink-600">TVC</span>:
                                <span className="text-orange-500">USOIL</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <button
                          className=" mt-3 m-auto hover:bg-green-600 bg-green-500 font-medium h-20 w-1/4 md:w-18 md:h-10  rounded-md  text-white "
                          type="submit"
                          onClick={(e) => {
                            //handle add
                            //toast stuff here
                            //call api here
                          }}>
                          Add
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="md:mt-6 h-max rounded-md bg-purple-800/40 text-white mx-auto  text-center w-full  ">
                    {/* rhs stuff here */}
                    <MultiSelect list={customList} setList={setCustomList} />
                  </div>
                </div>

                <div className="text-center mt-2 ">
                  <button
                    disabled={clickedSave}
                    className=" hover:bg-blue-600 rounded-md bg-blue-500 w-20 h-8  md:h-10 font-medium text-white "
                    onClick={handleSave}>
                    <div className="text-center flex mx-auto  w-1/2">
                      {!clickedSave ? (
                        "Save"
                      ) : (
                        <LoadingIcons.Puff
                          height="2em"
                          fill="white"
                          speed={0.75}
                        />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
