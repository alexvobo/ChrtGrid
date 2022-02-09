import React from "react";

export default function Blob({ color }) {
  return (
    <>
      <span className={`blob ${color}`}></span>
      <small className="relative mt-3">
        {color === "green" ? "ONLINE" : "OFFLINE"}
      </small>
    </>
  );
}
