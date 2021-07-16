import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import "./CheckoutForm.css";

export default function CheckoutForm(props) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe(); //access the stripe library
  const elements = useElements();

  // orderData should be [
  //   { id: "606dc59a75750e33d015983d", quantity: 2 },
  //   { id: "607ea6bc39cfab365442ef60", quantity: 2 },
  // ];

  useEffect(() => {
    //loadedOrder ={confirmedOrder: [{content:{...prop}, quantity: number}, {content: ..., qant...}...], totalPrice: number}
    const orderData = props.loadedOrder.confirmedOrder.map((item) => {
      return { id: item.content._id, quantity: item.quantity };
    });

    // Create PaymentIntent as soon as the page loads
    fetch("http://localhost:5000/api/order/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElement
        id="card-element"
        options={cardStyle}
        onChange={handleChange}
      />
      <button disabled={processing || disabled || succeeded} id="submit">
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show a success message upon completion */}
      <p className={succeeded ? "result-message" : "result-message hidden"}>
        Payment succeeded, see the result in your
        <a href={`https://dashboard.stripe.com/test/payments`}>
          {" "}
          Stripe dashboard.
        </a>{" "}
        Refresh the page to pay again.
      </p>
    </form>
  );
}

// // const CARD_OPTIONS = {
// //   style: {
// //     base: {
// //       fontSize: "16px",
// //       color: "#424770",
// //       "::placeholder": {
// //         color: "#aab7c4",
// //       },
// //     },
// //     invalid: {
// //       color: "#9e2146",
// //     },
// //   },
// // };
// const CARD_OPTIONS = {
//   iconStyle: "solid",
//   style: {
//     base: {
//       iconColor: "#c4f0ff",
//       color: "#fff",
//       fontWeight: 500,
//       fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
//       fontSize: "16px",
//       fontSmoothing: "antialiased",
//       ":-webkit-autofill": { color: "#fce883" },
//       "::placeholder": { color: "#87bbfd" },
//     },
//     invalid: {
//       iconColor: "#ffc7ee",
//       color: "#ffc7ee",
//     },
//   },
// };

// const PaymentForm = () => {
//   const [success, setSuccess] = useState(false);
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (event) => {
//     // Block native form submission.
//     event.preventDefault();

//     if (!stripe || !elements) {
//       // Stripe.js has not loaded yet. Make sure to disable
//       // form submission until Stripe.js has loaded.
//       return;
//     }

//     // Get a reference to a mounted CardElement. Elements knows how
//     // to find your CardElement because there can only ever be one of
//     // each type of element.
//     const cardElement = elements.getElement(CardElement);

//     // Use your card Element with other Stripe.js APIs
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card: cardElement,
//     });

//     if (error) {
//       console.log("[error]", error);
//     } else {
//       try {
//         const { id } = paymentMethod;
//         const response = await fetch(
//           "http://localhost:5000/api/users/payment",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ amount: 300, id: id }),
//           }
//         );
//         if (response.data.success) {
//           console.log("Successful payment");
//           setSuccess(true);
//         }
//       } catch (err) {
//         console.log(err.message);
//       }
//     }
//   };

//   return (
//     <React.Fragment>
//       {!success ? (
//         <form onSubmit={handleSubmit}>
//           <fieldset className="FormGroup">
//             <div className="FormRow">
//               <CardElement options={CARD_OPTIONS} />
//             </div>
//           </fieldset>
//           <button type="submit" disabled={!stripe}>
//             Pay
//           </button>
//         </form>
//       ) : (
//         <h2>Enjoy your product</h2>
//       )}
//     </React.Fragment>
//   );
// };

// export default PaymentForm;
