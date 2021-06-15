import React from "react";

import ShopCartItem from "./ShopCartItem";
import "./ShopCartList.css";

const ShopCartList = (props) => {
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
          quantity={
            props.itemsQuantity.find((item) => {
              return item.id === book.id;
            }).quantity
          }
          key={book.id}
          id={book.id}
          title={book.title}
          description={book.description}
          price={book.price}
          image={book.image}
        />
      ))}
    </ul>
  );
};

export default ShopCartList;
