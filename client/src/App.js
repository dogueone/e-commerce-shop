import "./App.css";
import React, { Component, Fragment } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import EditProductPage from "./pages/EditProductPage";
import AuthPage from "./pages/AuthPage";
import ProductsPage from "./pages/Products";
import NewProductPage from "./pages/NewProductPage";
import MainNavigation from "./components/Navigation/MainNavigation";
import ProductPage from "./pages/ProductPage";

// <Redirect from='/' to='/auth' exact />

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <MainNavigation />
          <main className="main-content all-center">
            <Switch>
              <Route path="/" component={ProductsPage} exact />
              <Route path="/auth" component={AuthPage} exact />;
              <Route
                path="/books/add-product"
                component={NewProductPage}
                exact
              />
              <Route
                path="/books/edit-product/:bid"
                component={EditProductPage}
              />
              <Route path="/books/:bid" component={ProductPage} />
              <Redirect to="/" />
            </Switch>
          </main>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
