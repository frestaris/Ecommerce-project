import React from "react";
import { Link } from "react-router-dom";

const ProductListItems = ({ product }) => {
  const { price, category, subs, shipping, color, brand, quantity, sold } =
    product;
  return (
    <div>
      <ul className="list-group">
        <li className="my-2 d-flex justify-content-between align-items-center">
          Price
          <span className="">${price}</span>
        </li>

        {category && (
          <li className="my-2 d-flex justify-content-between align-items-center">
            Category
            <Link
              to={`/category/${category.slug}`}
              style={{
                textDecoration: "none",
              }}
            >
              {category.name}
            </Link>
          </li>
        )}

        {subs && subs.length > 0 && (
          <li className="my-2 d-flex justify-content-between align-items-center">
            Sub Categories
            <div>
              {subs.map((s, index) => (
                <React.Fragment key={s._id}>
                  <Link
                    to={`/sub/${s.slug}`}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    {s.name}
                  </Link>
                  {index !== subs.length - 1 && " "}
                </React.Fragment>
              ))}
            </div>
          </li>
        )}
        <li className="my-2 d-flex justify-content-between align-items-center">
          Shipping
          <span className="">{shipping}</span>
        </li>
        <li className="my-2 d-flex justify-content-between align-items-center">
          Color
          <span className="">{color}</span>
        </li>
        <li className="my-2 d-flex justify-content-between align-items-center">
          Brand
          <span className="">{brand}</span>
        </li>
        <li className="my-2 d-flex justify-content-between align-items-center">
          Available
          <span className="">{quantity}</span>
        </li>
        <li className="my-2 d-flex justify-content-between align-items-center">
          Sold
          <span className="">{sold}</span>
        </li>
      </ul>
    </div>
  );
};

export default ProductListItems;
