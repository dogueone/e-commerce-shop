import React, { useContext, useState, useEffect } from "react";

import { MiscContext } from "../context/misc-context";
import Card from "./UIElements/Card";
import BookImage from "./UIElements/BookImage";
import "./CartItem.css";

const max = 10;

const CartItem = (props) => {
  const misc = useContext(MiscContext);
  const [disableDecrement, setDisableDecrement] = useState(false);
  const [disableIncrement, setDisableIncrement] = useState(false);

  useEffect(() => {
    props.quantity === 1
      ? setDisableDecrement(true)
      : setDisableDecrement(false);
    props.quantity === max
      ? setDisableIncrement(true)
      : setDisableIncrement(false);
    console.log("rerender");
  }, [props.quantity]);

  // const removeItemHandler = () => {};

  const incrementCartItemHandler = () => {
    const notParsedLocalData = localStorage.getItem("cart");
    if (!(notParsedLocalData === props.validLocalData)) {
      misc.clearCart();
      window.location.reload();
      console.log("Not valid local data");
      return;
    }

    const LocalData = JSON.parse(notParsedLocalData);
    let UpdatedLocalData;
    try {
      const ItemObject = { ...LocalData.find((item) => item.id === props.id) };
      const ItemQuantity = ItemObject.quantity;
      if (ItemQuantity === 10) {
        throw new Error("Maximum amount per transaction, can't add more");
      } else {
        UpdatedLocalData = LocalData.map((item) =>
          item.id === props.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      localStorage.setItem("cart", JSON.stringify(UpdatedLocalData));
      misc.setCartQuantity(
        UpdatedLocalData.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0)
      );
      props.updateCart(
        props.id,
        props.quantity,
        JSON.stringify(UpdatedLocalData),
        "increment"
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const decrementCartItemHandler = () => {
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
      props.updateCart(
        props.id,
        props.quantity,
        JSON.stringify(UpdatedLocalData),
        "decrement"
      );
    } catch (err) {}
  };

  return (
    <li className="cart-item">
      <Card className="cart-container void">
        <div className="cart-item__content">
          <BookImage
            imageStyle={"cart-item__image"}
            img={`http://localhost:5000/${props.image}`}
            alt={props.title}
          />
          <div className="cart-item__info">
            <p>{props.title}</p>
            <p>{props.price}</p>
          </div>
        </div>
        <div className="cart-item__ui">
          <h4>Quantity</h4>
          <p className="cart-item__ui--change unselectable">
            <span
              className={`material-icons-outlined ${
                disableDecrement && "disabled"
              }`}
              onClick={disableDecrement ? undefined : decrementCartItemHandler}
            >
              navigate_before
            </span>
            <span className="item-quantity">{props.quantity}</span>
            <span
              className={`material-icons-outlined ${
                disableIncrement && "disabled"
              }`}
              onClick={disableIncrement ? undefined : incrementCartItemHandler}
            >
              navigate_next
            </span>
          </p>
          <p className="cart-item__ui--remove unselectable">
            <span className="material-icons-outlined">highlight_off</span>
            <span>Remove </span>
          </p>
          {/* <div>{"Subtotal: " + props.quantity * props.price}</div> */}
        </div>
      </Card>
    </li>
  );
};

export default CartItem;
