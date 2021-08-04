import "./App.css";
import React, { Fragment, useState, useCallback, useEffect } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import { AuthContext } from "./context/auth-context";
import { MiscContext } from "./context/misc-context";
import EditProductPage from "./pages/EditProductPage";
import AuthPage from "./pages/AuthPage";
import ProductsPage from "./pages/Products";
import NewProductPage from "./pages/NewProductPage";
import MainNavigation from "./components/Navigation/MainNavigation";
import ProductPage from "./pages/ProductPage";
import ShopCartPage from "./pages/ShopCartPage";
import CheckoutPage from "./pages/CheckoutPage";

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [expirationDate, setExpirationDate] = useState();
  const [cartItemsQuantity, setCartItemsQuantity] = useState();
  const [checkingToken, setCheckingToken] = useState(true);

  const clearCart = useCallback((message = "Clearing cart") => {
    localStorage.removeItem("cart");
    console.log(message);
    setCartItemsQuantity(null);
  }, []);

  const addToCart = (productId, amount = 1) => {
    let cart;
    try {
      cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (error) {
      clearCart(error.name);
      return;
    }

    // let updatedCart;
    let existedItem;
    try {
      if (cart.length !== 0) {
        existedItem = cart.find((item) => item.id === productId);
      }
      if (existedItem) {
        if (
          isNaN(existedItem.quantity) ||
          existedItem.quantity < 1 ||
          !Number.isInteger(existedItem.quantity)
        ) {
          // clearCart();
          throw new Error("Wrong item quantity");
        }
        if (existedItem.quantity === 10) {
          console.log("Maximum item quantity per transaction, can't add more");
          return;
        }
        existedItem.quantity += amount;
        console.log(existedItem.quantity);
        if (existedItem.quantity > 10) {
          existedItem.quantity = 10;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        const cartItem = { id: productId, quantity: amount > 10 ? 10 : amount };
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      setCartQuantity(
        cart.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0)
      );
    } catch (error) {
      clearCart(error.message);
    }
  };

  const updateQuantity = useCallback(() => {
    try {
      const CartData = JSON.parse(localStorage.getItem("cart"));
      if (CartData) {
        let cartStorageItemCount = CartData.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0);
        cartStorageItemCount >= 0 && Number.isInteger(cartStorageItemCount)
          ? setCartItemsQuantity(cartStorageItemCount)
          : clearCart();
      }
    } catch (error) {
      clearCart(error.name);
      // window.location.reload();
    }
  }, []);

  const setCartQuantity = useCallback((updatedQuantity) => {
    updatedQuantity >= 0 && Number.isInteger(updatedQuantity)
      ? setCartItemsQuantity(updatedQuantity)
      : clearCart();
  }, []);

  const login = useCallback((userId, token, expiration) => {
    setToken(token);
    setUserId(userId);
    const tokenExpirationDate =
      expiration || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
    setCheckingToken(false);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && expirationDate) {
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, expirationDate, logout]);

  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem("userData"));
    if (
      storageData &&
      storageData.token &&
      new Date(storageData.expiration) > new Date()
    ) {
      login(
        storageData.userId,
        storageData.token,
        new Date(storageData.expiration)
      );
    } else {
      setCheckingToken(false);
    }
  }, [login]);

  useEffect(() => {
    updateQuantity(); //update cart items quantity
  }, [updateQuantity]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" component={ProductsPage} exact />
        <Route path="/auth" component={AuthPage} exact />
        <Route path="/books/add-product" component={NewProductPage} exact />
        <Route path="/books/edit-product/:bid" component={EditProductPage} />
        <Route path="/cart" component={ShopCartPage} exact />
        <Route path="/checkout" component={CheckoutPage} exact />
        <Route path="/books/:bid" component={ProductPage} />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" component={ProductsPage} exact />
        <Route path="/auth" component={AuthPage} exact />
        <Route path="/books/add-product" component={NewProductPage} exact />
        <Route path="/books/edit-product/:bid" component={EditProductPage} />
        <Route path="/cart" component={ShopCartPage} exact />
        <Route path="/books/:bid" component={ProductPage} />
        <Redirect to="/" />
      </Switch>
    );
  }

  if (checkingToken) {
    return <div>Loading Spinner</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        userId: userId,
        token: token,
        isLoggedIn: !!token,
        login: login,
        logout: logout,
      }}
    >
      <MiscContext.Provider
        value={{
          cartItemsQuantity: cartItemsQuantity,
          updateQuantity: updateQuantity,
          setCartQuantity: setCartQuantity,
          clearCart: clearCart,
          addToCart: addToCart,
        }}
      >
        <BrowserRouter>
          <Fragment>
            <MainNavigation />
            <main className="main-content">{routes}</main>
          </Fragment>
        </BrowserRouter>
      </MiscContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
