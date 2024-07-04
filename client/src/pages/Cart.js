import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import { toast } from "react-toastify";
import { selectUserAndCart } from "../reducers/selectors";
import { useNavigate } from "react-router-dom";
import { userCart } from "../functions/user";

const Cart = () => {
  const { user, cart } = useSelector(selectUserAndCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to calculate total dynamically
  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    userCart(cart, user.token)
      .then((res) => {
        console.log("CART POST RES", res);
        if (res.data.ok) navigate("/checkout");
      })
      .catch((err) => console.log("cart save err", err));
  };

  // Function to handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    // Ensure quantity is within valid range
    let count = quantity < 1 ? 1 : quantity;

    // Check if quantity exceeds available stock
    const product = cart.find((item) => item._id === productId);
    if (count > product.quantity) {
      toast.error(`Max available quantity: ${product.quantity}`);
      return;
    }

    // Update cart in local storage and Redux state
    let updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, count: count } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    dispatch({
      type: "ADD_TO_CART",
      payload: updatedCart,
    });
  };

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col">
          <h4>
            Cart / {cart.length} Product{cart.length !== 1 ? "s" : ""}
          </h4>
          {!cart.length ? (
            <p>
              No products in cart. <Link to="/shop">Continue Shopping.</Link>
            </p>
          ) : (
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Title</th>
                  <th scope="col">Price</th>
                  <th scope="col">Brand</th>
                  <th scope="col">Color</th>
                  <th scope="col">Count</th>
                  <th scope="col">Shipping</th>
                  <th scope="col">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((p) => (
                  <ProductCardInCheckout
                    key={p._id}
                    p={p}
                    handleQuantityChange={handleQuantityChange}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} x {c.count} = ${c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          Total: <b>${getTotal()}</b>
          <hr />
          {user ? (
            <button
              onClick={saveOrderToDb}
              className="btn btn-sm btn-success mt-2"
              disabled={!cart.length}
            >
              Proceed to Checkout
            </button>
          ) : (
            <button className="btn btn-sm btn-success mt-2">
              <Link
                to={{
                  pathname: "/login",
                  state: { from: "cart" },
                }}
                style={{ textDecoration: "none", color: "white" }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
