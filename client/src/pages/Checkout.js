import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
} from "../functions/user";
import { toast } from "react-toastify";
import { selectUserAndCoupon } from "../reducers/selectors";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  // discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const { user } = useSelector(selectUserAndCoupon); // Destructure the selected state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log("user cart res", JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, [user]);

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved!");
      }
    });
  };

  const showAddress = () => (
    <div>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="form-control"
        placeholder="Enter your Address..."
      />{" "}
      <button
        className="btn btn-outline-success mt-2"
        onClick={saveAddressToDb}
      >
        Save Address
      </button>
    </div>
  );

  const showProductSummary = () =>
    products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={" "}
          <b>${p.product.price * p.count}</b>
        </p>
      </div>
    ));

  const applyDiscountCoupon = () => {
    console.log("Coupon", coupon);
    applyCoupon(user.token, coupon)
      .then((res) => {
        console.log("RES ON COUPON APPLIED", res.data);
        if (res.data) {
          setTotalAfterDiscount(res.data.totalAfterDiscount); // Ensure this matches the server response structure
          console.log("Total After Discount:", res.data.totalAfterDiscount);
          setDiscountError(""); // Clear any previous errors
          dispatch({
            type: "COUPON_APPLIED",
            payload: true,
          });
        }
        if (res.data.err) {
          setDiscountError(res.data.err);
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
        }
      })
      .catch((error) => {
        console.error("Error applying coupon:", error);
        if (error.response && error.response.status === 400) {
          setDiscountError(error.response.data.error); // Assuming the server sends error message in this format
        } else {
          setDiscountError("An error occurred. Please try again.");
        }
      });
  };

  const showApplyCoupon = () => {
    return (
      <div>
        <input
          onChange={(e) => {
            setCoupon(e.target.value);
            setDiscountError("");
          }}
          value={coupon}
          type="text"
          className="form-control"
          placeholder="Enter your Coupon..."
        />
        <button
          onClick={applyDiscountCoupon}
          className="btn btn-outline-success mt-2"
        >
          Apply Coupon
        </button>
      </div>
    );
  };

  const emptyCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });

    emptyUserCart(user.token)
      .then((res) => {
        setProducts([]);
        setTotal(0);
        setTotalAfterDiscount(0);
        setCoupon("");
        toast.success("Cart is empty. Continue shopping.");
      })
      .catch((error) => {
        console.error("Error emptying cart", error);
        toast.error("Failed to empty cart");
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mt-3">
          <h4>Delivery Address</h4>
          <br />

          {showAddress()}

          <hr />
          <h4>Got Coupon?</h4>
          <br />
          {showApplyCoupon()}
          <br />
          {discountError && (
            <div className="bg-danger text-white p-2 ">{discountError}</div>
          )}
        </div>

        <div className="col-md-6 mt-3">
          <h4>Order Summary</h4>
          <hr />
          <p>Products {products.length}</p>
          <hr />
          {showProductSummary()}
          <hr />
          <p>
            Cart Total: <b>${total}</b>
          </p>
          {totalAfterDiscount > 0 && (
            <div className="bg-success p-2 text-white my-2">
              Discount Applied: Total Payable after discount: $
              {totalAfterDiscount}
            </div>
          )}

          <div className="row">
            <div className="col-md-6 mb-2">
              <button
                className="btn btn-success"
                disabled={!addressSaved || !products.length}
                onClick={() => navigate("/payment")}
              >
                Place Order
              </button>
            </div>

            <div className="col-md-6">
              {products.length > 0 && (
                <button onClick={emptyCart} className="btn btn-danger">
                  Empty Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
