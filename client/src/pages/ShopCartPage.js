import React, { useState, useEffect } from "react";

import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import Card from "../components/UIElements/Card";
import ShopCartList from "../components/ShopCartList";
import "./ShopCartPage.css";

let LocalData;

const ShopCartPage = () => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [loadedCart, setLoadedCart] = useState(null);
  const [checkout, setCheckout] = useState(null);

  const onOrderHandler = async () => {
    // 1) Open CheckoutPage with orderData [{id:31dse1sqr1ewdas, quantity: 2},{id:31dse1sqrsdad54, quantity: 1},..]
    // 2)
    // const MutatedLoadedCart = [];
    // loadedCart.forEach((item) => {
    //   return MutatedLoadedCart.push(
    //     (item = { id: item.content.id, quantity: item.quantity })
    //   );
    // });
    // try {
    //   const responseData = await sendRequest(
    //     "http://localhost:5000/api/books/cart/order",
    //     "POST",
    //     JSON.stringify(MutatedLoadedCart),
    //     {
    //       "Content-Type": "application/json",
    //     }
    //   );
    //   console.log(responseData);
    //   setCheckout(responseData);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const updateLoadedCartItem = (itemId, itemQuantity) => {
    const loadedCartClone = JSON.parse(JSON.stringify(loadedCart)); //to create deep clone
    if (itemQuantity === 1) {
      if (loadedCart.length === 1) {
        setLoadedCart(null);
      } else {
        const updatedLoadedCart = loadedCartClone.filter(
          (cartItem) => cartItem.content.id !== itemId
        );
        setLoadedCart(updatedLoadedCart);
      }
    } else {
      const selectedItem = loadedCartClone.find(
        (item) => item.content.id === itemId
      );
      selectedItem.quantity -= 1; //to change reference.quantity in loadedCartClone
      const updatedLoadedCart = loadedCartClone;
      setLoadedCart(updatedLoadedCart);
    }
  };

  useEffect(() => {
    LocalData = JSON.parse(localStorage.getItem("cart"));
    if (LocalData && LocalData.length !== 0) {
      const LocalDataIds = LocalData.map((item) => item.id);
      const fetchBooks = async () => {
        try {
          const loadedBooks = await sendRequest(
            `http://localhost:5000/api/books/local/${LocalDataIds}`
          );
          const MutatedLocalData = [];
          LocalData.forEach((item) => {
            return MutatedLocalData.push(
              (item = {
                content: loadedBooks.books.find((book) => book.id === item.id),
                quantity: item.quantity,
              })
            );
          });

          setLoadedCart(MutatedLocalData);
        } catch (err) {}
      };
      fetchBooks();
    } else {
      // localStorage.removeItem("cart");
      // setLoadedCart(null);
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

  if (checkout) {
    return (
      <div className="center">
        <Card>
          <h2>{JSON.stringify(checkout)}</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="shop-cart">
      <ShopCartList
        items={loadedCart}
        // itemsQuantity={LocalData}
        updateCart={updateLoadedCartItem}
      />
    </div>
  );
};

export default ShopCartPage;
