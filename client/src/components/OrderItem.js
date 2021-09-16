import React from "react";

import Card from "./UIElements/Card";
import BookImage from "./UIElements/BookImage";
import "./OrderItem.css";

const OrderItem = (props) => {
  return (
    <li className="order-item">
      <Card className="order-item__content">
        <BookImage
          imageStyle={"order-item__image"}
          img={props.image}
          alt={props.title}
        />

        <div className="order-item__grid">
          <div>
            <h2>{props.title}</h2>
          </div>
          <div>
            <h2>
              {props.quantity} <span>x</span> {props.price}
            </h2>
          </div>
          <div>
            <h2>{"Subtotal: " + props.quantity * props.price}</h2>
          </div>
        </div>
      </Card>
    </li>
  );
};

export default OrderItem;
