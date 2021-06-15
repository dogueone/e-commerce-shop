import React from "react";

import "./BookImage.css";

const BookImage = (props) => {
  return (
    <div className={props.imageStyle}>
      <img src={props.img} alt={props.alt} />
    </div>
  );
};

export default BookImage;
