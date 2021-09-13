import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ShopCartItem from "./ShopCartItem";
import "./ShopCartList.css";
import Button from "./FormElements/Button";

const ShopCartList = (props) => {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <ul className="cart-list-grid">
      <li className="cart-list-grid__header">
        <span></span>
        <strong>Title</strong>
        <strong>Price</strong>
        <strong>Quantity</strong>
        <strong>Subtotal</strong>
        <span></span>
      </li>
      {props.items.map((book) => (
        <ShopCartItem
          update={props.updateCart}
          validLocalData={props.validLocalData}
          quantity={book.quantity}
          key={book.content.id}
          id={book.content.id}
          title={book.content.title}
          description={book.content.description}
          price={book.content.price}
          image={book.content.image}
        />
      ))}
      <li className="cart-list-grid__footer">
        <strong>
          {auth.isLoggedIn ? (
            <Link
              to={{
                pathname: "/checkout",
                state: { cartItems: props.items },
              }}
            >
              Order Now
            </Link>
          ) : (
            <Link
              to={{
                pathname: "/auth",
                state: { prevLocation: location },
              }}
            >
              Log In
            </Link>
          )}
        </strong>
        <strong>{`total: ${props.items.reduce((sum, item) => {
          return sum + item.content.price * item.quantity;
        }, 0)}`}</strong>
      </li>
    </ul>
  );
};

export default ShopCartList;
