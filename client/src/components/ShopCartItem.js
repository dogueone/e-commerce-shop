import React, { useState, useEffect, useContext } from "react";

import "./ShopCartItem.css";

import Button from "./FormElements/Button";
import BookImage from "./UIElements/BookImage";
import { MiscContext } from "../context/misc-context";

const ShopCartItem = (props) => {
  const misc = useContext(MiscContext);

  const deleteCartItemHandler = () => {
    const notParsedLocalData = localStorage.getItem("cart");
    if (!(notParsedLocalData === props.validLocalData)) {
      misc.clearCart();
      window.location.reload();
      console.log("not valid local data");
      return;
    }

    const LocalData = JSON.parse(notParsedLocalData);
    let UpdatedLocalData;
    try {
      const ItemObject = { ...LocalData.find((item) => item.id === props.id) };
      const ItemQuantity = ItemObject.quantity;
      if (ItemQuantity <= 1) {
        UpdatedLocalData = LocalData.filter((item) => item.id !== props.id);
      } else {
        UpdatedLocalData = LocalData.map((item) =>
          item.id === props.id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      if (UpdatedLocalData.length === 0) {
        localStorage.removeItem("cart");
      } else {
        localStorage.setItem("cart", JSON.stringify(UpdatedLocalData));
      }
      misc.setCartQuantity(
        UpdatedLocalData.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0)
      );
      props.update(props.id, props.quantity, JSON.stringify(UpdatedLocalData));
    } catch (err) {}
  };

  return (
    <li className="cart-item-grid">
      <span>
        <BookImage img={"image"} alt={props.title} imageStyle={"cart-image"} />
      </span>
      <span>{props.title}</span>
      <span>{props.price}</span>
      <span>{props.quantity}</span>
      <span>{props.price * props.quantity}</span>
      <span>
        <input type="number" max={10} min={1}></input>
        <Button onClick={deleteCartItemHandler}>Remove item</Button>
        <Button></Button>
        {/* <button className="cart-item__remove" onClick={deleteCartItemHandler}>
          X
        </button> */}
      </span>
    </li>
  );
};

export default ShopCartItem;
