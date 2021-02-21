import "./App.css";
import React, { Component, Fragment } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import ProductsPage from "./pages/Products";
import AddProductPage from "./pages/AddProduct";
import MainNavigation from "./components/Navigation/MainNavigation";
import ProductPage from "./pages/ProductPage";

// <Redirect from='/' to='/auth' exact />
// <Route path='/auth' component={AuthPage} />

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <MainNavigation />
          <main className="main-content all-center">
            <Switch>
              <Route path="/" component={ProductsPage} exact />
              <Route
                path="/books/add-product"
                component={AddProductPage}
                exact
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
