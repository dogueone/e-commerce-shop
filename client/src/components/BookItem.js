import React, { useContext, useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Modal from "./UIElements/Modal";
import { AuthContext } from "../context/auth-context";
import { MiscContext } from "../context/misc-context";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { useHttpClient } from "../hooks/http-hook";
import Button from "../components/FormElements/Button";
import BookImage from "./UIElements/BookImage";
import Card from "./UIElements/Card";
import "./BookItem.css";

const BookItem = forwardRef((props, ref) => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [alert, setAlert] = useState(false);

  const auth = useContext(AuthContext);
  const misc = useContext(MiscContext);

  const imageClickHandler = () => {
    props.expandHandler(props.id);
  };

  const declineHandler = () => {
    setAlert(false);
  };

  const addToCartHandler = () => {
    //TO CHECK FOR ITEM QUANTITY (TEMPORARILY SOLUTION), because there is no data about max available items to sell for now
    let quantity;
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const queryItem = cart.find((item) => item.id === props.id);
      quantity = queryItem.quantity;
    } catch (error) {
      // clearCart(error.name);
      console.log(error);
    }
    misc.addToCart(props.id);

    if (quantity && quantity >= 10) {
      props.dispatch({
        type: "MAXIMUMITEMS",
        payload: {
          ukey: uuidv4(),
          content: "Can't add more than 10 items",
        },
      });
    } else {
      props.dispatch({
        type: "ADDTOCART",
        payload: {
          ukey: uuidv4(),
          content: props.title + " added to cart",
        },
      });
    }
  };

  const deleteBookHandler = async () => {
    setAlert(false);
    props.dispatch({
      type: "DELETEITEM",
      payload: {
        title: props.title,
        content: props.title + " successfully deleted",
      },
    });
    try {
      await sendRequest(
        `http://localhost:5000/api/books/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDeleteBook(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        header="Action Confirmation"
        onCancel={declineHandler}
        show={alert}
        children={"This action will delete item permanently, are you sure?"}
        footer={
          <React.Fragment>
            <Button neutral onClick={declineHandler}>
              Decline
            </Button>
            <Button danger onClick={deleteBookHandler}>
              Accept
            </Button>
          </React.Fragment>
        }
      ></Modal>
      <li ref={ref}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Card className="book-item__content">
            {/* <Link to={`books/${props.id}`}> */}
            <BookImage
              onClick={imageClickHandler}
              imageStyle="book-item__image"
              img={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
            {/* </Link> */}
            <div className="book-item__category">
              <p>Books</p>
            </div>

            <Link to={`books/${props.id}`}>
              <div className="book-item__info">
                <p>{props.title}</p>
              </div>
            </Link>
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
                  neutral
                  size={"small"}
                  to={`/books/edit-product/${props.id}`}
                >
                  EDIT
                </Button>
                <Button size={"small"} danger onClick={() => setAlert(true)}>
                  DELETE
                </Button>
              </div>
            )}
          </Card>
        )}
      </li>
    </React.Fragment>
  );
});

export default BookItem;
