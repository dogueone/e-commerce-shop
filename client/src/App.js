import "./App.css";
import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  Suspense,
} from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { MiscContext } from "./context/misc-context";
// import EditProductPage from "./pages/EditProductPage";
// import AuthPage from "./pages/AuthPage";
import ProductsPage from "./pages/Products";
// import NewProductPage from "./pages/NewProductPage";
import MainNavigation from "./components/Navigation/MainNavigation";
// import ProductPage from "./pages/ProductPage";
// import ShopCartPage from "./pages/ShopCartPage";
// import CheckoutPage from "./pages/CheckoutPage";
import LoadingSpinner from "./components/UIElements/LoadingSpinner";

//code splitting
const EditProductPage = React.lazy(() => import("./pages/EditProductPage"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const NewProductPage = React.lazy(() => import("./pages/NewProductPage"));
const ProductPage = React.lazy(() => import("./pages/ProductPage"));
const ShopCartPage = React.lazy(() => import("./pages/ShopCartPage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));

let logoutTimer;

const App = () => {
  const [cartItemsQuantity, setCartItemsQuantity] = useState();
  const [checkingToken, setCheckingToken] = useState(true);
  const [sorting, setSorting] = useState("A-Z Order");

  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

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
    }
  }, []);

  const setCartQuantity = useCallback((updatedQuantity) => {
    updatedQuantity >= 0 && Number.isInteger(updatedQuantity)
      ? setCartItemsQuantity(updatedQuantity)
      : clearCart();
  }, []);

  useEffect(() => {
    const { token, expirationDate } = auth;
    if (token && expirationDate) {
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      console.log("logout timer");
      logoutTimer = setTimeout(() => {
        dispatch({ type: "LOGOUT" });
      }, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [auth.token, auth.expirationDate]);

  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem("userData"));
    if (
      storageData &&
      storageData.token &&
      new Date(storageData.expiration) > new Date()
    ) {
      console.log("not expired");
      dispatch({
        type: "LOGIN",
        payload: {
          userId: storageData.userId,
          token: storageData.token,
          expiration: new Date(storageData.expiration),
          isLoggedIn: !!storageData.token,
        },
      });
      setCheckingToken(false);
    } else {
      console.log("no token, or expired");
      setCheckingToken(false);
    }
  }, []);

  useEffect(() => {
    updateQuantity(); //update cart items quantity
  }, [updateQuantity]);

  let routes;

  if (auth.token) {
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
    console.log("checking token");
    return null;
  }

  return (
    <MiscContext.Provider
      value={{
        cartItemsQuantity: cartItemsQuantity,
        updateQuantity: updateQuantity,
        setCartQuantity: setCartQuantity,
        clearCart: clearCart,
        addToCart: addToCart,
        sorting: sorting,
        setSorting: setSorting,
      }}
    >
      <BrowserRouter>
        <Fragment>
          <div className="background-layer"></div>
          <MainNavigation />
          {/* {checkingToken ? (
              <LoadingSpinner asOverlay />
            ) : (
              <main className="main-content">{routes}</main>
            )} */}

          {
            <main className="main-content">
              <Suspense fallback={<LoadingSpinner asOverlay />}>
                {routes}
              </Suspense>
            </main>
          }
        </Fragment>
      </BrowserRouter>
    </MiscContext.Provider>
  );
};

export default App;
