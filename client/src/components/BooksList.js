import React, { createRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import FlipMove from "react-flip-move";

import SortAnimationList from "../components/SortAnimationList";
import CheckoutItem from "./CheckoutItem";
import "./BooksList.css";
import BookItem from "./BookItem";
// import OrderItem from "./OrderItem";
import CartItem from "./CartItem";
// import { Link } from "react-router-dom";

const BooksList = (props, ref) => {
  // if (props.items.length === 0) {
  //   return (
  //     <div>
  //       <h2>No books found</h2>
  //     </div>
  //   );
  // }

  if (props.checkout) {
    return (
      <ul className="cart-list-grid">
        <li key={"header"} className="cart-list-grid__header">
          <div>Number</div>
          <div>Title</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Subtotal</div>
        </li>
        {props.loadedOrder.confirmedOrder.map((book, index) => (
          <CheckoutItem
            number={index + 1}
            quantity={book.quantity}
            key={book.content.id}
            id={book.content.id}
            title={book.content.title}
            price={book.content.price}
          />
        ))}
      </ul>
    );
  }

  if (props.cart) {
    return (
      <TransitionGroup component="ul" className="cart-list">
        {props.items.map((book) => (
          <CSSTransition
            key={book.content.id}
            appear={true}
            classNames="cart-item"
            timeout={500}
          >
            <CartItem
              validLocalData={props.validLocalData}
              updateCart={props.updateCart}
              clearCartState={props.clearCartState}
              id={book.content.id}
              title={book.content.title}
              description={book.content.description}
              image={book.content.image}
              price={book.content.price}
              quantity={book.quantity}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    );
  }

  return (
    // <ul className="books-list">
    <FlipMove
      typeName="ul"
      className={"books-list"}
      // staggerDurationBy={150}
      enterAnimation="fade"
      leaveAnimation="fade"
    >
      {/* <SortAnimationList> */}
      {props.items.map((book) => (
        <BookItem
          ref={createRef()}
          key={book.id}
          id={book.id}
          title={book.title}
          description={book.description}
          image={book.image}
          price={book.price}
          onDeleteBook={props.onDeleteBook}
          creatorId={book.creator}
          expandHandler={props.expandHandler}
          // order={}
        />
      ))}
      {/* </SortAnimationList> */}
    </FlipMove>
    // </ul>
  );
};

export default BooksList;

// if (props.checkout) {
//   return (
//     <React.Fragment>
//       <ul className={"order-list"}>
//         {props.loadedOrder.confirmedOrder.map((book) => (
//           <OrderItem
//             key={book.content._id}
//             title={book.content.title}
//             description={book.content.description}
//             image={book.content.image}
//             price={book.content.price}
//             quantity={book.quantity}
//           />
//         ))}
//       </ul>
//       <h2>{"Total Price: " + props.loadedOrder.totalPrice}</h2>
//       <Link to="/cart">Change Order</Link>
//     </React.Fragment>
//   );
// }
