export default function Blob({ color }) {
  return (
    <div className="grid grid-flow-col ">
      <span className={`blob ${color}`}></span>
      <small className="mt-3 text-md font-bold">
        {color === "green" ? "ONLINE" : "OFFLINE"}
      </small>
    </div>
  );
}
