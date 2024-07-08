import React from "react";

const ShowPaymentInfo = ({ order, showStatus = true }) => {
  const formattedAmount = (order.paymentIntent.amount /= 100).toLocaleString(
    "en-AU",
    {
      style: "currency",
      currency: "AUD",
    }
  );

  const orderStatusStyle = {
    backgroundColor:
      order.orderStatus.toLowerCase() === "processed" ? "green" : "red",
    color: "white",
    padding: "5px",
    borderRadius: "5px",
  };

  return (
    <div>
      <p>
        Order ID: <b>{order.paymentIntent.id}</b>
      </p>
      <p>
        Amount: <b>{formattedAmount}</b>
      </p>
      <p>
        Currency: <b>{order.paymentIntent.currency.toUpperCase()}</b>
      </p>
      <p>
        Method:{" "}
        <b>{order.paymentIntent.payment_method_types[0].toUpperCase()}</b>
      </p>
      <p>
        Payment: <b>{order.paymentIntent.status.toUpperCase()}</b>
      </p>
      <p>
        Order Date:{" "}
        <b>{new Date(order.paymentIntent.created * 1000).toLocaleString()}</b>
      </p>
      {showStatus && (
        <p style={orderStatusStyle}>Order Status: {order.orderStatus}</p>
      )}
    </div>
  );
};

export default ShowPaymentInfo;
