import React, { useState, useEffect, useContext } from "react";

import "./ShopCartItem.css";

import BookImage from "./UIElements/BookImage";
import { MiscContext } from "../context/misc-context";

const ShopCartItem = (props) => {
  const misc = useContext(MiscContext);
  const [cartItems, setCartItems] = useState();

  const deleteCartItemHandler = () => {
    const LocalData = JSON.parse(localStorage.getItem("cart"));
    let UpdatedLocalData;
    const ItemObject = { ...LocalData.find((item) => item.id === props.id) };
    const ItemQuantity = ItemObject.quantity;
    if (ItemQuantity === 1) {
      UpdatedLocalData = LocalData.filter((item) => item.id !== props.id);
    } else {
      UpdatedLocalData = LocalData.map((item) =>
        item.id === props.id ? { ...item, quantity: item.quantity - 1 } : item
      );
    }
    localStorage.setItem("cart", JSON.stringify(UpdatedLocalData));
    misc.setCartQantity(UpdatedLocalData.length);
  };

  return (
    <li className="cart-item-grid">
      <span>
        <BookImage
          img={`http://localhost:5000/${props.image}`}
          alt={props.title}
          imageStyle={"cart-image"}
        />
      </span>
      <span>{props.title}</span>
      <span>{props.price}</span>
      <span>{props.quantity}</span>
      <span>Subtotal</span>
      <span>
        <button className="cart-item__remove" onClick={deleteCartItemHandler}>
          X
        </button>
      </span>
    </li>
  );
};

export default ShopCartItem;
