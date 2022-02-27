import React, { useEffect, useState } from "react";
import LoadingIcons from "react-loading-icons";
export default function MultiSelect({ list, setList }) {
  const [selected, setSelected] = useState([]);

  function filterList(itemList, item) {
    //filters a list for an item
    return itemList.filter((listItem) => {
      if (listItem.exchange !== item.exchange) {
        return true;
      }
      if (listItem.symbol !== item.symbol) {
        return true;
      }
      if (listItem.pair !== item.pair) {
        return true;
      }

      return false;
    });
  }
  const handleChange = (e) => {
    //handles multiple selections
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(JSON.parse(options[i].value));
      }
    }
    setSelected(value);
  };

  const handleRemove = (e) => {
    //handles removing selection(s)
    e.preventDefault();
    let newList = list;
    selected.map((item) => {
      newList = filterList(newList, item);
    });
    setList(newList);
  };
  useEffect(() => {
    console.log(selected);
  }, [selected]);
  if (list.length === 0) {
    return (
      <div className="flex h-full justify-center items-center">
        Please add coins{" "}
      </div>
    );
  }
  if (!list || list === undefined) {
    return (
      <div className="flex h-full justify-center items-center">
        <LoadingIcons.Bars height="2em" fill="white" speed={0.75} />
      </div>
    );
  }
  return (
    <div className="">
      <select
        multiple={true}
        onChange={handleChange}
        className="text-white bg-transparent  w-full md:h-60 text-center">
        {list?.map((item, i) => (
          <option
            className="text-white   "
            key={i}
            value={JSON.stringify(item)}>
            {item?.exchange?.toUpperCase()}:{item?.symbol?.toUpperCase()}
            {item?.pair?.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="text-left ">
        <button
          className=" mt-4 hover:bg-red-700 bg-red-600 rounded-sm w-20 h-7 text-white "
          onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}
