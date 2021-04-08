import React from "react";

import "./BooksList.css";
import BookItem from "./BookItem";

const BooksList = (props) => {
  if (props.items.length === 0) {
    return (
      <div>
        <h2>No books found</h2>
      </div>
    );
  }

  return (
    <ul className="books-list">
      {props.items.map((book) => (
        <BookItem
          key={book.id}
          id={book.id}
          title={book.title}
          description={book.description}
          image={book.image}
          price={book.price}
          deleteBook={props.onDeleteBook}
        />
      ))}
    </ul>
  );
};

export default BooksList;
