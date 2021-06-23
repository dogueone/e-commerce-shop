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
  const [cartItems, setCartItems] = useState();

  // const increment = useCallback(() => {
  //   setCartItems((prevState) => prevState + 1);
  // }, []);

  // const decrement = useCallback(() => {
  //   setCartItems((prevState) => (prevState > 0 ? prevState - 1 : 0));
  // }, []);

  const updateQuantity = useCallback(() => {
    const CartData = JSON.parse(localStorage.getItem("cart"));
    if (CartData) {
      setCartItems(
        CartData.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0)
      );
    }
  }, []);

  const setCartQantity = useCallback((updatedLength) => {
    setCartItems(updatedLength);
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
    }
  }, [login]);

  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem("cart"));
    if (storageData && storageData.cart && storageData.cart.length !== 0) {
      login(
        storageData.userId,
        storageData.token,
        new Date(storageData.expiration)
      );
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
        <Route path="/books/add-product" component={NewProductPage} exact />
        <Route path="/books/edit-product/:bid" component={EditProductPage} />
        <Route path="/cart" component={ShopCartPage} />
        <Route path="/books/checkout" component={CheckoutPage} />
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
        <Route path="/cart" component={ShopCartPage} />
        <Route path="/books/checkout" component={CheckoutPage} />
        <Route path="/books/:bid" component={ProductPage} />
        <Redirect to="/" />
      </Switch>
    );
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
          cartItems: cartItems,
          // increment: increment,
          // decrement: decrement,
          updateQuantity: updateQuantity,
          setCartQantity: setCartQantity,
        }}
      >
        <BrowserRouter>
          <Fragment>
            <MainNavigation />
            <main className="main-content all-center">{routes}</main>
          </Fragment>
        </BrowserRouter>
      </MiscContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
