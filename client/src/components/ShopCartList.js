import React, { useContext } from "react";
import { Link } from "react-router-dom";

import ShopCartItem from "./ShopCartItem";
import "./ShopCartList.css";
import Button from "./FormElements/Button";
import { AuthContext } from "../context/auth-context";

const ShopCartList = (props) => {
  const auth = useContext(AuthContext);
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
          // quantity={
          //   props.itemsQuantity.find((item) => {
          //     return item.id === book.id;
          //   }).quantity
          // }
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
                pathname: "/books/checkout",
                state: { cartItems: props.items },
              }}
            >
              Order Now
            </Link>
          ) : (
            <Button to={"/auth"}>Order</Button>
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
