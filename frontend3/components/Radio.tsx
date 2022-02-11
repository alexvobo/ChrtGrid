import { RadioGroup } from "@headlessui/react";

export default function Radio({ value, setValue, listValues }) {
  return (
    <div className="w-full mb-4 ">
      <div className="w-full xs:max-w-md max-w-sm  md:max-w-md lg:max-w-md 2xl:max-w-lg mx-auto">
        <RadioGroup defaultChecked={value} value={value} onChange={setValue}>
          <div className=" grid grid-flow-row gap-1  ">
            {listValues.map((li, i) => (
              <RadioGroup.Option
                key={i}
                value={li}
                className={({ active, checked }) =>
                  `${
                    active
                      ? "ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60"
                      : ""
                  }
                    ${
                      checked
                        ? "bg-indigo-800 bg-opacity-75 text-white"
                        : "border-2 border-indigo-800 hover:bg-indigo-800"
                    }
                      relative rounded-sm shadow-md px-5 py-4 cursor-pointer flex focus:outline-none`
                }>
                {({ active, checked }) => (
                  <>
                    <div className={`flex items-center justify-between w-full ${checked ? "text-lg pl-2 pr-2": ""}`}>
                      <div className="flex items-center">
                        <div className="">
                          <RadioGroup.Label
                            as="p"
                            className="font-bold text-yellow-500 ">
                            {li.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`flex font-medium text-md ${
                              checked ? "text-sky-100" : "text-gray-200"
                            }`}>
                            <span>{li.description}</span>
                            {"  "}
                            <span aria-hidden="true" className="ml-2">
                              &middot;
                            </span>{" "}
                            <span className="ml-2 text-blue-500 hover:underline ">
                              {li.url}
                            </span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
