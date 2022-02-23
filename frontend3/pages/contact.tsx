import Layout from "../components/Layout";
import { useState, Fragment } from "react";
import validator from "validator";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";
import { useTimeoutFn } from "react-use";

const inquiry = [
  { name: "Bug Report" },
  { name: "Investor" },
  { name: "Payment" },
  { name: "Other" },
];
const formDefault = {
  name: "",
  email: "",
  wallet: "",
  twitter: "",
  subject: "",
  question: "",
};
export default function Contact() {
  const [selected, setSelected] = useState({ name: "" });

  let [isShowing, setIsShowing] = useState(true);
  let [, , resetIsShowing] = useTimeoutFn(() => setIsShowing(true), 500);
  const [form, setForm] = useState(formDefault);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      form?.name.trim().length === 0 ||
      form?.email.trim().length === 0 ||
      form?.subject.trim().length === 0 ||
      form?.question.trim().length === 0 ||
      selected?.name === ""
    ) {
      toast.error(
        "Please fill in the required fields: <Inquiry type>, <Name>, <Email>, <Subject>, <Inquiry>",
        {
          theme: "dark",
          position: "top-right",
          autoClose: 15000,
          closeOnClick: true,
          pauseOnHover: false,
        }
      );
    } else {
      if (validator.isEmail(form?.email)) {
        setIsShowing(false);
        //toast starting fetch

        const res = await fetch("/api/contactForm", {
          method: "POST",
          body: JSON.stringify({ form: form, inquiry: selected?.name }),
        });
        const id = toast.loading("Submitting form...", {
          theme: "dark",
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        if (res.status === 200) {
          console.log("Success");
          toast.update(id, {
            render: "Success",
            type: "success",
            isLoading: false,
          });
          setSelected({ name: "" });
          setForm(formDefault);
        } else {
          toast.update(id, {
            render: "Error",
            type: "error",
            isLoading: false,
          });
        }

        resetIsShowing();
      } else {
        toast.error("Email formatted incorrectly. Please try again.", {
          theme: "dark",
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: false,
        });
      }
    }
  };

  return (
    <div className="  w-full  xl:w-3/5 mt-4 rounded mx-auto p-4">
      {" "}
      <div className="text-center  text-blue-500 text-5xl mt-4 mb-12">
        contact us
      </div>
      <form action="#" method="POST">
        <div className="shadow overflow-hidden ">
          <div className="h-[700px]  px-4 py-5  border-2 border-pink-700 shadow-xl shadow-pink-600 sm:p-6 w-2/3 md:w-1/2 mx-auto sm:rounded-md">
            <div className="w-4/5 mx-auto grid grid-flow-row gap-4 mt-8  ">
              <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                  <Listbox.Button className=" border-2 border-blue-500 relative w-full py-2 pl-3 pr-10 text-left bg-transparent rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                    <span
                      className={`${
                        selected?.name === "" ? "text-white" : "text-blue-200"
                      } block truncate text-md font-medium`}>
                      {selected?.name !== ""
                        ? selected?.name
                        : "What is your inquiry type?"}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon
                        className="w-5 h-5 text-gray-200"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-slate-900 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {inquiry.map((q, qId) => (
                        <Listbox.Option
                          key={qId}
                          className={({ active }) =>
                            `cursor-default select-none relative py-2 pl-10 pr-4 ${
                              active
                                ? "text-blue-500 bg-slate-700/50"
                                : "text-pink-700 "
                            }`
                          }
                          value={q}>
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-bold" : "font-medium"
                                }`}>
                                {q.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                                  <CheckIcon
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              <div className="">
                <div className="mb-2">
                  <label
                    htmlFor="name"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-200">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={form.name}
                    required
                    placeholder="Satoshi Nakamoto"
                    autoComplete="given-name"
                    className="text-blue-400 border-2 p-2 border-pink-700 bg-transparent mt-1 focus:ring-blue-700 focus:border-blue-700 block w-full shadow-sm sm:text-sm  rounded-md"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="email"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-200">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    onChange={handleChange}
                    value={form.email}
                    required
                    placeholder="satoshin@gmx.com"
                    autoComplete="email"
                    className="text-blue-400  border-2 p-2 border-pink-700 bg-transparent mt-1 focus:ring-blue-700 focus:border-blue-700 block w-full shadow-sm sm:text-sm  rounded-md"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="wallet"
                    className="block text-sm font-medium text-gray-200">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    name="wallet"
                    onChange={handleChange}
                    value={form["wallet"]}
                    placeholder="optional"
                    className="text-blue-400 border-2 p-2 border-gray-400 bg-transparent mt-1 focus:ring-blue-700 focus:border-blue-700 block w-full shadow-sm sm:text-sm  rounded-md"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="twitter"
                    className="block text-sm font-medium text-gray-200">
                    Twitter Handle
                  </label>

                  <input
                    type="text"
                    name="twitter"
                    onChange={handleChange}
                    value={form["twitter"]}
                    placeholder="optional"
                    className="text-blue-400 border-2 p-2 border-gray-400 bg-transparent mt-1 focus:ring-blue-700 focus:border-blue-700 block w-full shadow-sm sm:text-sm  rounded-md"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="subject"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-200">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    onChange={handleChange}
                    value={form.subject}
                    required
                    placeholder={
                      selected.name === "Investor"
                        ? "I wish to purchase chrtGrid"
                        : "subject"
                    }
                    className="text-blue-400  border-2 p-2 border-pink-700 bg-transparent mt-1 focus:ring-blue-700 focus:border-blue-700 block w-full shadow-sm sm:text-sm  rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="question"
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-200">
                    Inquiry
                  </label>
                  <textarea
                    required
                    name="question"
                    onChange={handleChange}
                    value={form.question}
                    placeholder={
                      selected.name === ""
                        ? "Please select an inquiry type"
                        : selected?.name === "Payment"
                        ? "Please note that we not offer refunds.\nAll purchases are final."
                        : "Give us some more details, please."
                    }
                    className="resize-y rounded-md text-blue-400 border-2 p-2 border-pink-700 bg-transparent mt-1 focus:ring-blue-700 focus:border-blue-700 block w-full shadow-sm sm:text-sm"
                  />
                </div>
              </div>
              <div className="px-4 py-3 text-center sm:px-6">
                <Transition
                  as={Fragment}
                  show={isShowing}
                  enter="transform transition duration-[400ms]"
                  enterFrom="opacity-0 rotate-[-120deg] scale-50"
                  enterTo="opacity-100 rotate-0 scale-100"
                  leave="transform duration-200 transition ease-in-out"
                  leaveFrom="opacity-100 rotate-0 scale-100 "
                  leaveTo="opacity-0 scale-95 ">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className=" inline-flex h-10 mt-4 w-28 justify-center py-2 px-4 border border-transparent shadow-sm text-md font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">
                    Submit
                  </button>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

Contact.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
