import "./App.css";
import React, { Fragment, useState, useCallback } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import { AuthContext } from "./context/auth-context";
import EditProductPage from "./pages/EditProductPage";
import AuthPage from "./pages/AuthPage";
import ProductsPage from "./pages/Products";
import NewProductPage from "./pages/NewProductPage";
import MainNavigation from "./components/Navigation/MainNavigation";
import ProductPage from "./pages/ProductPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" component={ProductsPage} exact />
        <Route path="/books/add-product" component={NewProductPage} exact />
        <Route path="/books/edit-product/:bid" component={EditProductPage} />
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
        <Route path="/books/:bid" component={ProductPage} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <BrowserRouter>
        <Fragment>
          <MainNavigation />
          <main className="main-content all-center">{routes}</main>
        </Fragment>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
