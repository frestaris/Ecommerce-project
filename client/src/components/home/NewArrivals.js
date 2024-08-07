import React, { useEffect, useState } from "react";
import { getProducts, getProductsCount } from "../../functions/product";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";
import { Pagination } from "antd";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => setProductsCount(res.data));
  }, []);

  const loadAllProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts("createdAt", "desc", page);
      setProducts(res.data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCard count={4} />
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="row">
          <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
            <Pagination
              current={page}
              total={productsCount * 1.5}
              onChange={(value) => setPage(value)}
            />
          </nav>
        </div>
      </div>
    </>
  );
};

export default NewArrivals;
