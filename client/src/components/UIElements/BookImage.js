import React from "react";

import "./BookImage.css";

const BookImage = (props) => {
  return (
    <div className="book-image">
      <img src={props.image} alt={props.alt} />
    </div>
  );
};

export default BookImage;
