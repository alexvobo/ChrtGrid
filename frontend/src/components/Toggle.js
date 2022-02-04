import React from "react";
import { Switch } from "@headlessui/react";
function Toggle({ toggle, onToggle }) {
  return (
    <Switch.Group>
      <div className="ml-4 flex items-center">
        <Switch.Label className="mr-4">Latest</Switch.Label>
        <Switch
          checked={toggle}
          onChange={onToggle}
          className={`${toggle ? "bg-teal-900" : "bg-gray-400"}
      relative inline-flex flex-shrink-0 h-[30px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}>
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${toggle ? "translate-x-9" : "translate-x-0"}
        pointer-events-none inline-block h-[26px] w-[26px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
          />
        </Switch>
        <Switch.Label className="ml-4">Random</Switch.Label>
      </div>
    </Switch.Group>
  );
}

export default Toggle;
