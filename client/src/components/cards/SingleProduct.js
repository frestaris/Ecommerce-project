import React from "react";
import { Card, Tabs } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import ProductListItems from "./ProductListItems";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import laptop from "../../images/laptop.png";

const SingleProduct = ({ product }) => {
  const { title, images, description } = product;

  const { TabPane } = Tabs;

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

        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call us on xxx xxx xxx xxx to learn more about this product!
          </TabPane>
        </Tabs>
      </div>
      <div className="col-md-5">
        <h2 className="bg-dark text-white rounded p-3">{title}</h2>
        <Card
          actions={[
            <>
              <ShoppingCartOutlined className="text-success" /> Add to Cart
            </>,
            <Link to={`/`}>
              <HeartOutlined className="text-info" /> <br /> Add to Wishlist
            </Link>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </div>
  );
};

export default SingleProduct;
