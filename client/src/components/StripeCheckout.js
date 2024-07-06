import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";
import { Link, useNavigate } from "react-router-dom";
import { selectUserAndCoupon } from "../reducers/selectors";
import { Card } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import laptop from "../images/laptop.png";
import { createOrder, emptyUserCart } from "../functions/user";

const StripeCheckout = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  const { user, coupon } = useSelector(selectUserAndCoupon);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) {
      createPaymentIntent(user.token, coupon)
        .then((res) => {
          console.log("create payment intent", res.data);
          setClientSecret(res.data.clientSecret);
          setCartTotal(res.data.cartTotal);
          setTotalAfterDiscount(res.data.totalAfterDiscount);
          setPayable(res.data.payable);
        })
        .catch((err) => {
          console.error("Error creating payment intent:", err);
          setError("Failed to initialize payment. Please try again.");
        });
    }
  }, [user, coupon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: e.target.name.value,
          },
        },
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
      } else {
        // Payment succeeded, proceed with order creation
        try {
          const orderResponse = await createOrder(payload, user.token);
          if (orderResponse.data.ok) {
            // Clear cart from local storage
            if (typeof window !== "undefined") localStorage.removeItem("cart");

            // Clear cart from Redux
            dispatch({
              type: "ADD_TO_CART",
              payload: [],
            });

            // Reset coupon
            dispatch({
              type: "COUPON_APPLIED",
              payload: false,
            });

            // Clear cart from database
            emptyUserCart(user.token);

            console.log(JSON.stringify(payload, null, 4));
            setError(null);
            setProcessing(false);
            setSucceeded(true);
          } else {
            setError("Order creation failed");
            setProcessing(false);
          }
        } catch (orderError) {
          setError(`Order creation failed: ${orderError.message}`);
          setProcessing(false);
        }
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setError(`Payment failed: ${error.message}`);
      setProcessing(false);
    }
  };

  const handleChange = async (e) => {
    try {
      setDisabled(e.empty);
      setError(e.error ? e.error.message : "");
    } catch (error) {
      console.error("Error handling change:", error);
    }
  };

  const cartStyle = {
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

  return (
    <>
      {!succeeded && (
        <div>
          {coupon ? (
            <p className="alert alert-success">
              Total after discount: <b>${totalAfterDiscount}</b>
            </p>
          ) : (
            <p className="alert alert-danger">No coupon applied</p>
          )}
        </div>
      )}
      <div className="text-center pb-5">
        <Card
          cover={
            <img
              src={laptop}
              style={{
                height: "200px",
                objectFit: "contain",
                marginBottom: "-50px",
              }}
            />
          }
          actions={[
            <>
              <DollarOutlined className="text-info" /> <br /> Total: $
              {cartTotal}
            </>,
            <>
              <CheckOutlined className="text-info" /> <br /> Total payable :
              <b> ${(payable / 100).toFixed(2)}</b>
            </>,
          ]}
        />
      </div>

      <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          options={cartStyle}
          onChange={handleChange}
        />
        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
        >
          <span id="button-text">
            {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
          </span>
        </button>
        <br />
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}
        <br />
        <p className={succeeded ? "result-message" : "result-message hidden"}>
          Payment Successful.{" "}
          <Link to="/user/history">See it in your purchase history.</Link>
        </p>
      </form>
    </>
  );
};

export default StripeCheckout;
