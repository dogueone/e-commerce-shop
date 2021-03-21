import React from "react";

import "./BookPages.css";

const BookPages = (props) => {
  return (
    <div>
      <h1>Books pages</h1>
      <div>
        <img src={props.content.image} alt={props.content.title} />
      </div>
    </div>
  );
};

export default BookPages;
