import React from "react";
import { Card } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptop from "../../../src/images/laptop.png";
import { Link } from "react-router-dom";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { images, title, description, slug } = product;

  return (
    <div>
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
          title={title}
          description={`${description && description.substring(0, 30)}...`}
        />
      </Card>
    </div>
  );
};

export default ProductCard;
