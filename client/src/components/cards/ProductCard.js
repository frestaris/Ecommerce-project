import React from "react";
import { Card } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptop from "../../../src/images/laptop.png";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { images, title, description, slug, price } = product;

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
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br />
            View Product
          </Link>,
          <>
            {" "}
            <ShoppingCartOutlined
              // onClick={() => handleRemove(slug)}
              className="text-danger"
            />{" "}
            <br />
            Add to Cart
          </>,
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
