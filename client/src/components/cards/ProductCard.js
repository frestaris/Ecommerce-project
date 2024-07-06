import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptop from "../../../src/images/laptop.png";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { selectUserAndCart } from "../../reducers/selectors";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { images, title, description, slug, price, quantity } = product;
  const [tooltip, setToolTip] = useState("Click to add");

  // redux
  const { user, cart } = useSelector(selectUserAndCart);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    let cart = [];
    if (typeof window !== "undefined") {
      // Ensure localStorage is accessible
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // Push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // Remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      // Save to local storage
      console.log("Product added to cart:", unique); // Log the updated cart
      localStorage.setItem("cart", JSON.stringify(unique));

      setToolTip("Added");

      dispatch({
        type: "ADD_TO_CART",
        payload: unique, // Ensure unique cart is dispatched
      });
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  return (
    <div>
      <div className="mb-2">
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="py-2">"No rating yet"</div>
        )}
      </div>
      <Card
        className="mb-2"
        style={{ width: "300px" }}
        cover={
          <img
            alt=""
            src={images && images.length ? images[0].url : laptop}
            style={{ height: "150px", objectFit: "cover" }}
            className="p-1"
          />
        }
        actions={[
          <Link
            to={`/product/${slug}`}
            style={{
              textDecoration: "none",
            }}
          >
            <EyeOutlined className="text-warning" /> <br />
            View Product
          </Link>,
          <Tooltip title={product.quantity < 1 ? "Out of stock" : tooltip}>
            <span>
              <a
                onClick={product.quantity > 0 ? handleAddToCart : undefined}
                style={{
                  cursor: product.quantity > 0 ? "pointer" : "not-allowed",
                  pointerEvents: product.quantity > 0 ? "auto" : "none",
                  color: product.quantity > 0 ? "" : "gray",
                  textDecoration:
                    product.quantity > 0 ? "none" : "line-through",
                }}
              >
                <ShoppingCartOutlined className="text-success" />
                <br />
                {quantity < 1 ? "Out of stock" : "Add to Cart"}
              </a>
            </span>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - $ ${price}`}
          description={`${description && description.substring(0, 30)}...`}
        />
      </Card>
    </div>
  );
};

export default ProductCard;
