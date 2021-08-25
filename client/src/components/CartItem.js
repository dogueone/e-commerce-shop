import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

  const removeItemHandler = () => {
    const notParsedLocalData = localStorage.getItem("cart");

    if (!(notParsedLocalData === props.validLocalData)) {
      misc.clearCart("Not a valid local data");
      props.clearCartState();
      return;
    }

    const LocalData = JSON.parse(notParsedLocalData);
    let UpdatedLocalData;

    try {
      const ItemObject = { ...LocalData.find((item) => item.id === props.id) };
      if (ItemObject) {
        if (LocalData.length === 1) {
          misc.clearCart();
          props.clearCartState();
        } else {
          UpdatedLocalData = LocalData.filter((item) => item.id !== props.id);
          localStorage.setItem("cart", JSON.stringify(UpdatedLocalData));
          props.updateCart(
            props.id,
            props.quantity,
            UpdatedLocalData,
            "remove"
          );
        }
      }
    } catch (err) {}
  };

  const incrementCartItemHandler = () => {
    const notParsedLocalData = localStorage.getItem("cart");

    if (!(notParsedLocalData === props.validLocalData)) {
      misc.clearCart("Not a valid local data");
      props.clearCartState();
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
      props.updateCart(props.id, props.quantity, UpdatedLocalData, "increment");
    } catch (err) {
      console.log(err.message);
    }
  };

  const decrementCartItemHandler = () => {
    const notParsedLocalData = localStorage.getItem("cart");

    if (!(notParsedLocalData === props.validLocalData)) {
      misc.clearCart("Not a valid local data");
      props.clearCartState();
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
      props.updateCart(props.id, props.quantity, UpdatedLocalData, "decrement");
    } catch (err) {}
  };

  return (
    <li className="cart-item">
      <Card className="void">
        <div className="cart-item__container">
          <div className="cart-item__content">
            <Link to={`/books/${props.id}`}>
              <BookImage
                imageStyle={"cart-item__image"}
                img={`http://localhost:5000/${props.image}`}
                alt={props.title}
              />
            </Link>
            <div className="cart-item__info">
              <Link to={`/books/${props.id}`}>{props.title}</Link>
              <span>{"$" + props.price.toFixed(2)}</span>
            </div>
          </div>
          <div className="cart-item__ui">
            <h4>Quantity</h4>
            <p className="cart-item__ui--change unselectable">
              <span
                className={`material-icons-outlined ${
                  disableDecrement && "disabled"
                }`}
                onClick={
                  disableDecrement ? undefined : decrementCartItemHandler
                }
              >
                navigate_before
              </span>
              <span className="item-quantity">{props.quantity}</span>
              <span
                className={`material-icons-outlined ${
                  disableIncrement && "disabled"
                }`}
                onClick={
                  disableIncrement ? undefined : incrementCartItemHandler
                }
              >
                navigate_next
              </span>
            </p>
            <p
              className="cart-item__ui--remove unselectable"
              onClick={removeItemHandler}
            >
              <span className="material-icons-outlined">highlight_off</span>
              <span>Remove </span>
            </p>
            {/* <div>{"Subtotal: " + props.quantity * props.price}</div> */}
          </div>
        </div>
      </Card>
    </li>
  );
};

export default CartItem;
