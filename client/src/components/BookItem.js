import React from "react";
import { Link } from "react-router-dom";

import BookImage from "./UIElements/BookImage";
import Card from "./UIElements/Card";
import "./BookItem.css";

const BookItem = (props) => {
  return (
    <li className="book-item">
      <Card className="book-item__content">
        <Link to={`/books/${props.id}`}>
          <div className="book-item__image">
            <BookImage image={props.image} alt={props.title} />
          </div>
          <div className="book-item__info">
            <h2>{props.title}</h2>
          </div>
          <div>
            <h2>{props.price}</h2>
          </div>
        </Link>
        <Link to={`/books/edit-product/${props.id}`}>
          <div className="editproduct-test">EDIT</div>
        </Link>
      </Card>
    </li>
  );
};

export default BookItem;
