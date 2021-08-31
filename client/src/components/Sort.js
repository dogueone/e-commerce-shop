import React, { forwardRef, useContext, useEffect } from "react";

import "./Sort.css";
import { MiscContext } from "../context/misc-context";

const Sort = forwardRef((props, ref) => {
  const misc = useContext(MiscContext);

  const selectHandler = (e) => {
    console.log("CHANGED");
    misc.setSorting(e.target.value);
    props.sortProducts(e.target.value);
  };

  // useEffect(() => {
  //   console.log(misc.sorting);
  // }, []);

  // onChange={(e) => misc.setSorting(e.target.value)

  return (
    <div ref={ref} className="sort">
      <span className="sort-label">Sort By: </span>
      <select
        className="sort-dropdown"
        value={misc.sorting || "A-Z Order"}
        onChange={selectHandler}
      >
        <option value="A-Z Order">A-Z Order</option>
        <option value="Z-A Order">Z-A Order</option>
        <option value="Low-Hight Price">Low-Hight Price</option>
        <option value="High-Low Price">High-Low Price</option>
      </select>
    </div>
  );
});
export default Sort;
