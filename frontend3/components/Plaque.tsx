import React from "react";

function Plaque({ membership }) {
  const memberships = {
    lifetime: " shadow-lg shadow-pink-500 rainbow-effect ",
    pro: "",
    free: "",
  };

  if (!membership) {
    return null;
  }
  return (
    <div
      className={`text-center mx-auto w-3/4 h-12 rounded-sm ${
        memberships[membership.toLowerCase()]
      }`}>
      <div className="pt-1 text-2xl text-center font-extrabold hover:animate-pulse  ">
        {membership.toUpperCase()}
      </div>
    </div>
  );
}

export default Plaque;
