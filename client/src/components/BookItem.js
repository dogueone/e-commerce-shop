import React from "react";
import { Link } from "react-router-dom";

import BookImage from "./UIElements/BookImage";

import "./BookItem.css";
import Card from "./UIElements/Card";

const BookItem = (props) => {
  return (
    <li className="book-item">
      <Card className="book-item__content">
        <Link to={`/${props.id}`}>
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
      </Card>
    </li>
  );
};

export default BookItem;
