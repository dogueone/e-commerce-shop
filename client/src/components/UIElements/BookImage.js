import React from "react";

import "./BookImage.css";

const BookImage = (props) => {
  return (
    <div className="book-image">
      {/* <img src={props.image} alt={props.alt} /> */}
      {props.image}
    </div>
  );
};

export default BookImage;
