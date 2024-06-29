import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Drawer } from "antd";
import { Link } from "react-router-dom";
import laptop from "../../images/laptop.png";

const SideDrawer = () => {
  const { drawer, cart } = useSelector((state) => ({
    drawer: state.drawer,
    cart: state.cart,
  }));
  const dispatch = useDispatch();

  const imageStyle = {
    width: "100%",
    height: "50px",
    objectFit: "cover",
  };

  const onCloseDrawer = () => {
    dispatch({
      type: "SET_VISIBLE",
      payload: false,
    });
  };

  return (
    <div>
      <Drawer
        className="text-center"
        title={`Cart / ${cart.length} Product${cart.length !== 1 ? "s" : ""}`}
        onClose={onCloseDrawer}
        open={drawer}
      >
        {cart.map((p) => (
          <div key={p._id} className="row mb-3">
            <div className="col">
              {p.images.length ? (
                <img src={p.images[0].url} style={imageStyle} alt={p.title} />
              ) : (
                <img src={laptop} style={imageStyle} alt="laptop" />
              )}
              <p className="text-center bg-secondary text-light">
                {p.title} x {p.count}
              </p>
            </div>
          </div>
        ))}
        <Link
          onClick={onCloseDrawer}
          to="/cart"
          className="btn btn-success btn-raised btn-block"
        >
          Go to Cart
        </Link>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
