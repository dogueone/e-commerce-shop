import React, { useState, useEffect } from "react";

import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import Card from "../components/UIElements/Card";
import ShopCartList from "../components/ShopCartList";
import "./ShopCartPage.css";

let LocalData;

const ShopCartPage = () => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [loadedCart, setLoadedCart] = useState();

  useEffect(() => {
    LocalData = JSON.parse(localStorage.getItem("cart"));
    if (LocalData && LocalData.length !== 0) {
      const ParsedLocalData = LocalData.map((item) => item.id);
      console.log(ParsedLocalData);
      const fetchBooks = async () => {
        try {
          const loadedBooks = await sendRequest(
            `http://localhost:5000/api/books/cart/${ParsedLocalData}`
          );
          setLoadedCart(loadedBooks.books);
        } catch (err) {}
      };
      fetchBooks();
    }
  }, [sendRequest]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />;
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
    <div className="shop-cart">
      <ShopCartList items={loadedCart} itemsQuantity={LocalData} cart />
    </div>
  );
};

export default ShopCartPage;
