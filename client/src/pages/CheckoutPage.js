import React, { useEffect, useState, useContext } from "react";
import { useLocation, useHistory, Redirect } from "react-router-dom";

import Card from "../components/UIElements/Card";
import { useHttpClient } from "../hooks/http-hook";
import StripeContainer from "../components/StripeContainer";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import BookList from "../components/BooksList";
import { AuthContext } from "../context/auth-context";
import ErrorModal from "../components/UIElements/ErrorModal";

const CheckoutPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedOrder, setLoadedOrder] = useState();
  const location = useLocation();
  const history = useHistory();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!location.state) {
      history.replace({
        pathname: "/cart",
      });
    } else {
      const CartItems = location.state.cartItems;
      const onOrderHandler = async () => {
        const MutatedLoadedCart = [];
        CartItems.forEach((item) => {
          return MutatedLoadedCart.push(
            (item = { id: item.content.id, quantity: item.quantity })
          );
        });
        try {
          const responseData = await sendRequest(
            "http://localhost:5000/api/order/cart/order",
            "POST",
            JSON.stringify(MutatedLoadedCart),
            {
              "Content-Type": "application/json",
            }
          );
          setLoadedOrder(responseData);
        } catch (err) {
          console.log(err);
        }
      };
      onOrderHandler();
    }
  }, [sendRequest, history, location.state, auth.isLoggedIn]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedOrder && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find any books!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && !error && loadedOrder ? (
        <div className={"checkout-container"}>
          <BookList order loadedOrder={loadedOrder} />
          <StripeContainer loadedOrder={loadedOrder} />
        </div>
      ) : (
        <Redirect to={"/"} />
      )}
    </React.Fragment>
  );
};

export default CheckoutPage;
