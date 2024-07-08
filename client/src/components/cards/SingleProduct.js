import React, { useState } from "react";
import { Card, Tabs, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import ProductListItems from "./ProductListItems";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import laptop from "../../images/laptop.png";
import StarRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist } from "../../functions/user";
import { toast } from "react-toastify";

const SingleProduct = ({ product, onStarClick, star }) => {
  const { title, images, description, _id, quantity } = product;

  const [tooltip, setToolTip] = useState("Click to add");

  // redux
  const { user, cart } = useSelector((state) => ({
    user: state.user,
    cart: state.cart,
  }));

  const navigate = useNavigate();
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

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token).then((res) => {
      toast.success("Added to wishlist");
      navigate("/user/wishlist");
    });
  };

  const tabItems = [
    {
      key: "1",
      label: "Description",
      children: description && description,
    },
    {
      key: "2",
      label: "More",
      children: "Call us on xxx xxx xxx xxx to learn more about this product!",
    },
  ];

  return (
    <div className="row p-4">
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showThumbs={true}>
            {images &&
              images.map((image) => (
                <div key={image.public_id}>
                  <img src={image.url} alt={image.public_id} />
                </div>
              ))}
          </Carousel>
        ) : (
          <Card
            cover={<img alt="" src={laptop} className="mb-3 card-image" />}
          ></Card>
        )}

        <Tabs type="card" items={tabItems} />
      </div>
      <div className="col-md-5">
        <h2 className="bg-dark text-white rounded p-3">{title}</h2>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center py-2">"No rating yet"</div>
        )}
        <div className="text-center m-2"></div>
        <Card
          actions={[
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
            <a onClick={handleAddToWishlist}>
              <HeartOutlined className="text-info" /> <br /> Add to Wishlist
            </a>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="gold"
                starHoverColor="gold"
                starDimension="40px"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </div>
  );
};

export default SingleProduct;
