import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth-context";
import { MiscContext } from "../context/misc-context";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { useHttpClient } from "../hooks/http-hook";
import Button from "../components/FormElements/Button";
import BookImage from "./UIElements/BookImage";
import Card from "./UIElements/Card";
import "./BookItem.css";

const BookItem = (props) => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();

  const auth = useContext(AuthContext);
  const misc = useContext(MiscContext);

  const deleteBookHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/books/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.deleteBook(props.id);
    } catch (err) {}
  };

  const addToCartHandler = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // let updatedCart;
    let existedItem;
    try {
      if (cart.length !== 0) {
        existedItem = cart.find((item) => item.id === props.id);
      }
      if (existedItem) {
        if (
          isNaN(existedItem.quantity) ||
          existedItem.quantity < 1 ||
          !Number.isInteger(existedItem.quantity)
        ) {
          misc.clearCart();
          throw new Error("wrong item quantity");
        }
        existedItem.quantity += 1; //increment item reference by 1
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        const cartItem = { id: props.id, quantity: 1 };
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      misc.setCartQuantity(
        cart.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0)
      );
    } catch (error) {
      misc.clearCart();
      console.log(error.message);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <li className="book-item">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Card className="book-item__content animated">
            <BookImage
              imageStyle="book-item__image"
              img={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
            <div className="book-item__category">
              <p>Books</p>
            </div>
            <div className="book-item__info">
              <p>{props.title}</p>
            </div>
            {/* <div className="book-item__info">
              <p>check description</p>
            </div> */}
            <div className="book-item__price">
              <p>{"$" + props.price}</p>
            </div>
            <Button size={"big"} onClick={addToCartHandler}>
              ADD TO CART
            </Button>
            {auth.isLoggedIn && auth.userId === props.creatorId && (
              <div className="book-item__update">
                <Button
                  inverse
                  size={"small"}
                  to={`/books/edit-product/${props.id}`}
                  onClick={deleteBookHandler}
                >
                  EDIT
                </Button>
                <Button size={"small"} danger onClick={deleteBookHandler}>
                  DELETE
                </Button>
              </div>
            )}
          </Card>
        )}
      </li>
    </React.Fragment>
  );
};

export default BookItem;
