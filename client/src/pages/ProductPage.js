import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import NotificationsList from "../components/UIElements/NotificationsList";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import Dropdown from "../components/UIElements/Dropdown";
import * as actionTypes from "../store/actions/notificationsA";
import { MiscContext } from "../context/misc-context";
import Button from "../components/FormElements/Button";
import BookImage from "../components/UIElements/BookImage";
import Card from "../components/UIElements/Card";
import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import Modal from "../components/UIElements/Modal";
import BookContent from "../components/BookContent";
import BookPages from "../components/BookPages";
import "./ProductPage.css";

const ProductPage = () => {
  const [loadedProduct, setLoadedProduct] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const productId = useParams().bid;
  const [amount, setAmount] = useState(1);
  const misc = useContext(MiscContext);
  // const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    //TO CHECK FOR ITEM QUANTITY (TEMPORARILY SOLUTION), because there is no data about max available items to sell for now
    let quantity;
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const queryItem = cart.find((item) => item.id === loadedProduct.id);
      quantity = queryItem.quantity;
    } catch (error) {
      // clearCart(error.name);
      console.log(error);
    }
    misc.addToCart(loadedProduct.id, amount);

    if (quantity && quantity >= 10) {
      dispatch(
        actionTypes.pushNotification(actionTypes.maximumItemsAC, {
          content: "Can't add more than 10 items",
        })
      );
    } else {
      dispatch(
        actionTypes.pushNotification(actionTypes.addToCartAC, {
          content: loadedProduct.title + " added to cart",
        })
      );
    }

    // if (quantity && quantity >= 10) {
    //   dispatch({
    //     type: actionTypes.MAXIMUM_ITEMS,
    //     payload: {
    //       ukey: uuidv4(),
    //       content: "Can't add more than 10 items",
    //     },
    //   });
    // } else {
    //   dispatch({
    //     type: actionTypes.ADD_TO_CART,
    //     payload: {
    //       ukey: uuidv4(),
    //       content: loadedProduct.title + " added to cart",
    //     },
    //   });
    // }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/books/${productId}`
        );
        setLoadedProduct(data.book);
        console.log(data);
      } catch (err) {}
    };
    fetchProductData();
  }, [sendRequest]);

  const onSelectHandler = (event) => {
    setAmount(parseInt(event.target.value, 10));
    console.log(event.target.value);
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  // if (!isLoading && !loadedProduct && !error) {
  //   return (
  //     <div className="center">
  //       <Card>
  //         <h2>Could not find product for provided id!</h2>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* {showModal && <Modal hideModal={closeModalHandler} />} */}
      {/* {!isLoading && !loadedProduct && !error && (
        <div className="center">
          <Card>
            <h2>Could not find product for provided id!</h2>
          </Card>
        </div>
      )} */}
      {!isLoading && loadedProduct && (
        <>
          <div className="product-page__title">{loadedProduct.title}</div>
          <Card className="product-page void">
            <div className="product-page__image">
              <BookImage
                imageStyle="product-image"
                img={loadedProduct.image}
                alt={loadedProduct.title}
              />
            </div>
            <div className="product-page__content">
              <div className="product-page__content--info">
                <span className="product-page__content--price">{`$${loadedProduct.price.toFixed(
                  2
                )}`}</span>
              </div>
              <div>{loadedProduct.description}</div>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
                tempore, modi laudantium deleniti saepe mollitia architecto
                impedit beatae incidunt a sint officia quaerat unde obcaecati,
                cum distinctio odio? Deserunt, aliquid?
              </div>
              <Dropdown />
              <div className="product-page__content--cart">
                <select onChange={onSelectHandler}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <Button onClick={addToCartHandler}>Add Product</Button>
              </div>
            </div>
          </Card>
        </>
      )}
      <NotificationsList />
    </React.Fragment>
  );
};

export default ProductPage;
