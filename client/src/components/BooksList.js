import React from "react";

import "./BooksList.css";
import BookItem from "./BookItem";
import OrderItem from "./OrderItem";

const BooksList = (props) => {
  // if (props.items.length === 0) {
  //   return (
  //     <div>
  //       <h2>No books found</h2>
  //     </div>
  //   );
  // }

  if (props.order) {
    return (
      <React.Fragment>
        <ul className={"order-list"}>
          {props.loadedOrder.confirmedOrder.map((book) => (
            <OrderItem
              key={book.content.id}
              id={book.content.id}
              title={book.content.title}
              description={book.content.description}
              image={book.content.image}
              price={book.content.price}
              quantity={book.quantity}
            />
          ))}
        </ul>
        <h2>{"Total Price: " + props.loadedOrder.totalPrice}</h2>
        <h2>Change order</h2>
      </React.Fragment>
    );
  }

  return (
    <ul className={"books-list"}>
      {props.items.map((book) => (
        <BookItem
          key={book.id}
          id={book.id}
          title={book.title}
          description={book.description}
          image={book.image}
          price={book.price}
          deleteBook={props.onDeleteBook}
          creatorId={book.creator}
        />
      ))}
    </ul>
  );
};

export default BooksList;
