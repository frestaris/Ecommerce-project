import React from "react";
import { Card, Tabs } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import ProductListItems from "./ProductListItems";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import laptop from "../../images/laptop.png";
import StarRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../functions/rating";

const SingleProduct = ({ product, onStarClick, star }) => {
  const { title, images, description, _id } = product;

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
            <>
              <ShoppingCartOutlined className="text-success" /> Add to Cart
            </>,
            <Link to={`/`}>
              <HeartOutlined className="text-info" /> <br /> Add to Wishlist
            </Link>,
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
