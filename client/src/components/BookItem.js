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
    if (cart.length !== 0) {
      existedItem = cart.find((item) => item.id === props.id);
    }
    if (existedItem) {
      // updatedCart = [...cart];
      // const itemIndex = cart.findIndex((item) => item.id === props.id);
      // cart[itemIndex] = {
      //   id: props.id,
      //   quantity: cart[itemIndex].quantity + 1,
      // };
      existedItem.quantity += 1; //increment item reference by 1
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      const cartItem = { id: props.id, quantity: 1 };
      // updatedCart = [...cart];
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    misc.setCartQantity(
      cart.reduce((sum, item) => {
        return sum + item.quantity;
      }, 0)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <li className="book-item">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Card className="book-item__content">
            {/* <Link to={`/books/${props.id}`}> */}
            <div className="book-item__image">
              <BookImage
                img={`http://localhost:5000/${props.image}`}
                alt={props.title}
                imageStyle="book-image"
              />
            </div>
            <div className="book-item__info">
              <h2>{props.title}</h2>
            </div>
            <div className="book-item__info">
              <h2>{props.description}</h2>
            </div>
            <div>
              <h2>{props.price}</h2>
            </div>
            {/* </Link> */}
            <Link to={`/books/edit-product/${props.id}`}>
              <div className="editproduct-test">EDIT</div>
            </Link>
            <Button size={"small"} onClick={addToCartHandler}>
              ADD TO CART
            </Button>
            {auth.isLoggedIn && auth.userId === props.creatorId && (
              <Button size={"small"} inverse onClick={deleteBookHandler}>
                DELETE
              </Button>
            )}
          </Card>
        )}
      </li>
    </React.Fragment>
  );
};

export default BookItem;
