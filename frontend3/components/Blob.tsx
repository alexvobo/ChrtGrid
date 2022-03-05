//Returns a glowing orb (green or red) that will flash when the frontend has a connection to the database.
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
