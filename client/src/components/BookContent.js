import React from "react";

import BookImage from "./UIElements/BookImage";
import "./BookContent.css";

const BookContent = (props) => {
  return (
    <div className="book-content">
      <div className="book-content__image">
        <BookImage image={props.content.image} alt={props.content.title} />
      </div>
      <div className="book-content__info">
        <h2>{props.content.title}</h2>
      </div>
      <div className="book-content__description">
        <p>{props.content.description}</p>
      </div>
      <button className="book-content__btn" onClick={props.showModal}>
        Buy
      </button>
    </div>
  );
};

export default BookContent;
