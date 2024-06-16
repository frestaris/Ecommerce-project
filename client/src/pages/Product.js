import React, { useEffect, useState } from "react";
import { getProduct } from "../functions/product";
import { useParams } from "react-router-dom";
import SingleProduct from "../components/cards/SingleProduct";

const Product = () => {
  const [product, setProduct] = useState({});
  let { slug } = useParams();

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  const loadSingleProduct = () =>
    getProduct(slug).then((res) => setProduct(res.data));
  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct product={product} />
      </div>
      <div className="row p-5">
        <div className="col text-center">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Product;
