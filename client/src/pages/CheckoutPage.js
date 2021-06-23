import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import Card from "../components/UIElements/Card";
import { useHttpClient } from "../hooks/http-hook";
import StripeContainer from "../components/StripeContainer";
import ShopCartItem from "../components/ShopCartItem";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import BookList from "../components/BooksList";

const CheckoutPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedOrder, setLoadedOrder] = useState();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (!location.state) {
      history.push({
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
            "http://localhost:5000/api/books/cart/order",
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
      console.log(loadedOrder);
    }
  }, [sendRequest, history, location.state]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const responseData = await sendRequest(
  //         "http://localhost:5000/api/users/payment",
  //         "POST",
  //         JSON.stringify({ amount: 300, currency: "usd" }),
  //         {
  //           "Content-Type": "application/json",
  //         }
  //       );
  //       console.log(responseData.client_secret);
  //       // stripe.confirmCardPayment(responseData.client_secret)
  //     } catch (err) {}
  //   };
  //   fetchData();
  // }, [sendRequest]);

  // const responseData = fetch("http://localhost:5000/api/users/payment", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ amount: 300, currency: "usd" }),
  // })
  //   .then((response) => response.json())
  //   .then((responseJson) => {
  //     console.log(responseJson);
  //     return responseJson.client_secret;
  //   })
  //   .catch((err) => console.log(err));
  // setLoadedOrder(responseData);
  // console.log(responseData);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />;
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
      {loadedOrder ? (
        <div className={"checkout-container"}>
          <BookList order loadedOrder={loadedOrder} />
          <StripeContainer />
        </div>
      ) : (
        <h2>what</h2>
      )}
    </React.Fragment>
  );
};

{
  /* <form id="payment-form">
        <div id="card-element"></div>
        <button id="submit">
          <div class="spinner hidden" id="spinner"></div>
          <span id="button-text">Pay now</span>
        </button>
        <p id="card-error" role="alert"></p>
        <p class="result-message hidden">
          Payment succeeded, see the result in your
          <a href="" target="_blank">
            Stripe dashboard.
          </a>{" "}
          Refresh the page to pay again.
        </p>
      </form> */
}

export default CheckoutPage;

// const authSubmitHandler = async (event) => {
//   event.preventDefault();
//   if (isLoginMode) {
//     try {
//       const responseData = await sendRequest(
//         "http://localhost:5000/api/users/login",
//         "POST",
//         JSON.stringify({
//           email: formState.inputs.email.value,
//           password: formState.inputs.password.value,
//         }),
//         {
//           "Content-Type": "application/json",
//         }
//       );
//       auth.login(responseData.userId, responseData.token);
//     } catch (err) {}
//   } else {
//     try {
//       const responseData = await sendRequest(
//         "http://localhost:5000/api/users/signup",
//         "POST",
//         JSON.stringify({
//           name: formState.inputs.name.value,
//           email: formState.inputs.email.value,
//           password: formState.inputs.password.value,
//         }),
//         {
//           "Content-Type": "application/json",
//         }
//       );
//       auth.login(responseData.userId, responseData.token);
//     } catch (err) {}
//   }
//   console.log(formState.inputs);
// };
