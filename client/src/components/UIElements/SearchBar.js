import React from "react";

import "./SearchBar.css";

const SearchBar = (props) => {
  return (
    <div className={"search-bar"}>
      <input className="search-bar__input" type="text" />
    </div>
  );
};

export default SearchBar;
