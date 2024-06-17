import React, { useEffect, useState } from "react";
import { getProduct, productStar } from "../functions/product";
import { useParams } from "react-router-dom";
import SingleProduct from "../components/cards/SingleProduct";
import { useSelector } from "react-redux";
import { getRelated } from "../functions/product";
import ProductCard from "../components/cards/ProductCard";

const Product = () => {
  const [product, setProduct] = useState({});
  const [star, setStar] = useState(0);
  const user = useSelector((state) => state.user);
  const [related, setRelated] = useState([]);

  let { slug } = useParams();

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (element) => element.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star); // current user star
    }
  });

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    productStar(name, newRating, user.token)
      .then((res) => {
        console.log("Rating response", res.data);
        loadSingleProduct();
      })
      .catch((err) => {
        console.error("Rating error", err);
      });
  };

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data);
      getRelated(res.data._id).then((res) => setRelated(res.data));
    });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>
      <div className="row p-5">
        <div className="col text-center">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
      <div className="row m-5">
        {related.length > 0 ? (
          related.map((r) => (
            <div key={r._id} className="col">
              <ProductCard product={r} />
            </div>
          ))
        ) : (
          <div className="text-center">No products found</div>
        )}
      </div>
    </div>
  );
};

export default Product;
