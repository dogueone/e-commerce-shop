import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from "./CheckoutForm";
import "./StripeContainer.css";

//configure the stripe library
const stripeTestPromise = loadStripe(
  "pk_test_x4KWR34udGTq4XQblt6LcMi800scwfNf6X"
);

const StripeContainer = (props) => {
  return (
    <div className="stripe">
      <Elements stripe={stripeTestPromise}>
        <CheckoutForm loadedOrder={props.loadedOrder} />
      </Elements>
    </div>
  );
};

export default StripeContainer;
