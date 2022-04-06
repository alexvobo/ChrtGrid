import React from "react";
//Display a formatted plaque for the membership tier, part of the <Account> component
export default function Plaque({ membership }) {
  const memberships = {
    lifetime: " rainbow-effect  ",
    pro: "",
    free: "",
  };

  if (!membership) {
    return null;
  }
  return (
    <div
      className={`text-center text-sm md:text-md m-auto w-full px-2 pb-1 rounded-sm ${
        memberships[membership.toLowerCase()]
      }`}>
      <div className="pt-1  text-center font-extrabold  ">
        {membership.toUpperCase()}
      </div>
    </div>
  );
}
