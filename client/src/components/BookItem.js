import React, { useContext, useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { connect, useSelector, useDispatch } from "react-redux";

import Modal from "./UIElements/Modal";
import { MiscContext } from "../context/misc-context";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { useHttpClient } from "../hooks/http-hook";
import Button from "../components/FormElements/Button";
import BookImage from "./UIElements/BookImage";
import Card from "./UIElements/Card";
import * as actionTypes from "../store/actions/notificationsA";
import "./BookItem.css";

// const mapStateToProps = (state) => {
//   return {
//     popUpList: state,
//   };
// };
// const mapDispatchToProps = (dispatch) => {
//   return {
//     onProductAdded: (payload) => {
//       dispatch({ type: actionTypes.ADD_TO_CART, payload: payload });
//     },
//     onProductRemoved: (payload) => {
//       dispatch({ type: actionTypes.DELETE_ITEM, payload: payload });
//     },
//     onMaximumItems: (payload) => {
//       dispatch({ type: actionTypes.MAXIMUM_ITEMS, payload: payload });
//     },
//   };
// };

const BookItem = forwardRef((props, ref) => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [alert, setAlert] = useState(false);

  const misc = useContext(MiscContext);

  const popUpList = useSelector((state) => state.notifications);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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

    console.log(popUpList);
    const ukey = uuidv4();

    if (quantity && quantity >= 10) {
      dispatch(
        actionTypes.pushNotification(actionTypes.maximumItemsAC, {
          content: "Can't add more than 10 items",
        })
      );
      // dispatch({
      //   type: actionTypes.MAXIMUM_ITEMS,
      //   payload: {
      //     ukey: ukey,
      //     content: "Can't add more than 10 items",
      //   },
      // });
    } else {
      dispatch(
        actionTypes.pushNotification(actionTypes.addToCartAC, {
          content: props.title + " added to cart",
        })
      );
      // dispatch({
      //   type: actionTypes.ADD_TO_CART,
      //   payload: {
      //     ukey: ukey,
      //     content: props.title + " added to cart",
      //   },
      // });
      // dispatch(actionTypes.itemTimeoutACAsync({ ukey }));
    }
    // if (quantity && quantity >= 10) {
    //   props.onMaximumItems({
    //     ukey: uuidv4(),
    //     content: "Can't add more than 10 items",
    //   });
    // } else {
    //   props.onProductAdded({
    //     ukey: uuidv4(),
    //     content: props.title + " added to cart",
    //   });
    // }
  };

  const deleteBookHandler = async () => {
    setAlert(false);
    // props.onProductRemoved({
    //   title: props.title,
    //   content: props.title + " successfully deleted",
    // });
    // dispatch({
    //   type: actionTypes.DELETE_ITEM,
    //   payload: {
    //     title: props.title,
    //     content: props.title + " successfully deleted",
    //   },
    // });
    dispatch(
      actionTypes.pushNotification(actionTypes.deleteItemAC, {
        content: props.title + " successfully deleted",
      })
    );
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/books/${props.id}`,
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
            <Button mr neutral onClick={declineHandler}>
              Decline
            </Button>
            <Button mr danger onClick={deleteBookHandler}>
              Accept
            </Button>
          </React.Fragment>
        }
      ></Modal>
      <li ref={ref}>
        <Card className="book-item__content animated">
          <BookImage
            onClick={imageClickHandler}
            imageStyle="book-item__image"
            img={props.image}
            alt={props.title}
          />
          <div className="book-item__p">
            <div className="book-item__category" onClick={imageClickHandler}>
              <p>Category</p>
            </div>
            <div className="book-item__info" onClick={imageClickHandler}>
              {props.title}
            </div>
            {/* <Link className="book-item__info" to={`books/${props.id}`}>
            </Link> */}
            {/* <div className="book-item__info">
              <p>check description</p>
            </div> */}
            <div className="book-item__price">
              <p>{"$" + props.price.toFixed(2)}</p>
            </div>
            <div className={"book-item__controls"}>
              <Button
                // style={{
                //   display: "flex",
                //   alignItems: "center",
                //   justifyContent: "center",
                //   fontSize: "0.9rem",
                // }}
                wide
                onClick={addToCartHandler}
              >
                Add to cart
              </Button>
              {auth.isLoggedIn && auth.userId === props.creatorId && (
                <div className="book-item__update">
                  <Button neutral wide to={`/books/edit-product/${props.id}`}>
                    Edit
                  </Button>
                  <Button danger wide onClick={() => setAlert(true)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
});

// export default React.forwardRef((props, ref) => {
//   return <BookItem {...props} inputRef={ref} />;
// });

export default BookItem;

// export default connect(mapStateToProps, mapDispatchToProps)(BookItem);
