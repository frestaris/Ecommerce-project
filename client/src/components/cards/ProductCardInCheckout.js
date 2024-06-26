import React from "react";
import ModalImage from "react-modal-image";
import laptop from "../../images/laptop.png";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ProductCardInCheckout = ({ p }) => {
  const dispatch = useDispatch();
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];

  const handleColorChange = (e) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach((product, i) => {
      if (product._id === p._id) {
        cart[i].color = e.target.value;
      }
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });
  };

  const handleQuantityChange = (e) => {
    let count = e.target.value < 1 ? 1 : e.target.value;

    if (count > p.quantity) {
      toast.error(`Max available quantity: ${p.quantity}`);
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.forEach((product, i) => {
      if (product._id === p._id) {
        cart[i].count = count;
      }
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });
  };

  const handleRemove = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((product) => product._id !== p._id); // Remove the item from cart

    localStorage.setItem("cart", JSON.stringify(cart));
    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });
  };

  return (
    <tr>
      <td>
        <div style={{ width: "100px", height: "auto" }}>
          {p.images.length ? (
            <ModalImage small={p.images[0].url} large={p.images[0].url} />
          ) : (
            <ModalImage small={laptop} large={laptop} />
          )}
        </div>
      </td>
      <td>{p.title}</td>
      <td>${p.price}</td>
      <td>{p.brand}</td>
      <td>
        <select
          onChange={handleColorChange}
          name="color"
          className="form-control"
        >
          {p.color ? (
            <option value={p.color}>{p.color}</option>
          ) : (
            <option>Select</option>
          )}
          {colors
            .filter((c) => c !== p.color)
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          value={p.count}
          onChange={handleQuantityChange}
        />
      </td>
      <td className="text-center">
        {p.shipping === "Yes" ? (
          <CheckCircleOutlined className="text-success" />
        ) : (
          <CloseCircleOutlined className="text-danger" />
        )}
      </td>
      <td className="text-center">
        <CloseOutlined onClick={handleRemove} className="text-danger pointer" />
      </td>
    </tr>
  );
};

export default ProductCardInCheckout;
