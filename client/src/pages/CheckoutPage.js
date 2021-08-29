import React, { useEffect, useState, useContext } from "react";
import { useLocation, useHistory, Redirect } from "react-router-dom";

import Modal from "../components/UIElements/Modal";
import Button from "../components/FormElements/Button";
import Card from "../components/UIElements/Card";
import { useHttpClient } from "../hooks/http-hook";
import StripeContainer from "../components/StripeContainer";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import BookList from "../components/BooksList";
import { AuthContext } from "../context/auth-context";
import ErrorModal from "../components/UIElements/ErrorModal";
import "./CheckoutPage.css";
import BackElement from "../components/UIElements/BackElement";

const CheckoutPage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedOrder, setLoadedOrder] = useState();
  const [paymentAction, setPaymentAction] = useState(false);
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
            `${process.env.REACT_APP_BACKEND_URL}/order/cart/order`,
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
    return <LoadingSpinner asOverlay />;
  }

  if (!loadedOrder && !error) {
    return <BackElement>Could not find any products</BackElement>;
  }

  return (
    <React.Fragment>
      <Modal
        header="TEST PAYMENT"
        onCancel={() => setPaymentAction(false)}
        show={paymentAction}
        children={<StripeContainer loadedOrder={loadedOrder} />}
        footer={
          <React.Fragment>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p style={{ marginLeft: "0.5rem" }}>
                4242 4242 4242 4242 - succeed payment
                <br />
                4000 0025 0000 3155 - auth fail
                <br />
                4000 0000 0000 9995 - payment declined
              </p>
              <Button
                mr
                style={{ height: "2.5rem" }}
                neutral
                onClick={() => setPaymentAction(false)}
              >
                Cancel
              </Button>
            </div>
          </React.Fragment>
        }
      ></Modal>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && !error && loadedOrder ? (
        <div className="checkout-container">
          <BookList checkout loadedOrder={loadedOrder} />
          <div className="checkout-grid__footer">
            <div className="checkout-grid__footer--info">
              <div>
                <h4>Payment Info:</h4>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
                  veniam explicabo numquam reprehenderit labore odio, nihil
                  voluptate molestias ratione! Omnis!
                </p>
              </div>
              <div>
                <h4>Terms and conditions:</h4>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Ducimus at facilis modi expedita. Possimus officia blanditiis
                  at in et debitis?
                </p>
              </div>
            </div>
            <div className="checkout-grid__footer--total">
              <div
                style={{
                  fontSize: "0.9rem",
                }}
              >
                Subtotal:
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                }}
              >{`$${loadedOrder.confirmedOrder
                .reduce((sum, item) => {
                  return sum + item.content.price * item.quantity;
                }, 0)
                .toFixed(2)}`}</div>
              <div
                style={{
                  fontSize: "0.9rem",
                }}
              >
                Discount:
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                }}
              >
                0.00%
              </div>
              <div
                style={{
                  borderTop: "2px solid #ddd",
                  fontSize: "1.2rem",
                  fontWeight: 500,
                }}
              >
                Total:
              </div>
              <div
                style={{
                  borderTop: "2px solid #ddd",
                  width: "82px",
                  fontSize: "1.2rem",
                }}
              >{`$${loadedOrder.confirmedOrder
                .reduce((sum, item) => {
                  return sum + item.content.price * item.quantity;
                }, 0)
                .toFixed(2)}`}</div>
            </div>
          </div>
          <div className="checkout-ui">
            <Button
              style={{
                marginLeft: "32px",
                justifySelf: "center",
              }}
              neutral
              to="/cart"
            >
              Change Order
            </Button>
            <div
              style={{
                width: "250px",
                marginRight: "16px",
              }}
            >
              <Button wide onClick={() => setPaymentAction(true)}>
                Pay
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Redirect to={"/"} />
      )}
    </React.Fragment>
  );
};

export default CheckoutPage;
