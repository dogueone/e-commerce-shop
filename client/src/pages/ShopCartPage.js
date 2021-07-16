import React, { useState, useEffect, useContext } from "react";

import { MiscContext } from "../context/misc-context";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import Card from "../components/UIElements/Card";
import ShopCartList from "../components/ShopCartList";
import ErrorModal from "../components/UIElements/ErrorModal";
import "./ShopCartPage.css";

const ShopCartPage = () => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [loadedCart, setLoadedCart] = useState(null);
  const [validLocalData, setValidLocalData] = useState(null);

  const misc = useContext(MiscContext);

  const updateLoadedCartItem = (itemId, itemQuantity, newValidLocalData) => {
    const loadedCartClone = JSON.parse(JSON.stringify(loadedCart)); //to create deep clone
    if (itemQuantity === 1) {
      if (loadedCart.length === 1) {
        setLoadedCart(null);
      } else {
        const updatedLoadedCart = loadedCartClone.filter(
          (cartItem) => cartItem.content.id !== itemId
        );
        setLoadedCart(updatedLoadedCart);
        setValidLocalData(newValidLocalData);
      }
    } else {
      const selectedItem = loadedCartClone.find(
        (item) => item.content.id === itemId
      );
      selectedItem.quantity -= 1; //to change reference.quantity in loadedCartClone
      const updatedLoadedCart = loadedCartClone;
      setLoadedCart(updatedLoadedCart);
      setValidLocalData(newValidLocalData);
    }
  };

  useEffect(() => {
    let Valid = true;
    const notParsedLocalData = localStorage.getItem("cart");

    if (notParsedLocalData === null) {
      Valid = false;
      misc.clearCart();
    }

    if (Valid && !notParsedLocalData) {
      Valid = false;
      misc.clearCart();
      console.log("empty string");
    }
    let LocalData;
    if (Valid) {
      LocalData = JSON.parse(notParsedLocalData);
      if (!Array.isArray(LocalData) || LocalData.length === 0) {
        Valid = false;
        misc.clearCart();
        console.log("cart is an empty array or not an array, storage cleared");
      }
    }
    let LocalDataIds;
    if (Valid) {
      LocalDataIds = LocalData.map((item) => item.id);
      for (let i of LocalDataIds) {
        if (!i || i.length != 24) {
          Valid = false;
          misc.clearCart();
          console.log("cart is not valid");
          break;
        }
      }
    }

    if (Valid) {
      let loadedBooks;
      const fetchBooks = async () => {
        try {
          loadedBooks = await sendRequest(
            `http://localhost:5000/api/books/local/${LocalDataIds}`
          );

          if (loadedBooks) {
            const MutatedLocalData = [];
            LocalData.forEach((item) => {
              const itemQuantity = item.quantity;
              if (
                isNaN(itemQuantity) ||
                itemQuantity < 1 ||
                !Number.isInteger(itemQuantity)
              ) {
                throw new Error("Wrong item quantity");
              }
              return MutatedLocalData.push(
                (item = {
                  content: loadedBooks.books.find(
                    (book) => book.id === item.id
                  ),
                  quantity: itemQuantity,
                })
              );
            });
            setLoadedCart(MutatedLocalData);
            setValidLocalData(notParsedLocalData);
          }
        } catch (err) {
          setLoadedCart(null);
          misc.clearCart();
          console.log(err.message);
        }
      };
      fetchBooks();
    }
  }, [sendRequest]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedCart && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Shoping cart is empty!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && !error && loadedCart && (
        <div className="shop-cart">
          <ShopCartList
            items={loadedCart}
            validLocalData={validLocalData}
            // itemsQuantity={LocalData}
            updateCart={updateLoadedCartItem}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default ShopCartPage;
