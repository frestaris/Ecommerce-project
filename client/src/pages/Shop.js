import React, { useState, useEffect } from "react";
import {
  getProductsByCount,
  fetchProductsByFilter,
} from "../functions/product";
import { getCategories } from "../functions/category";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import { Menu, Slider, Checkbox, Radio } from "antd";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Star from "../components/forms/Star";

const Shop = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesIds, setCategoriesIds] = useState([]);
  const [star, setStar] = useState(null);
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "Asus",
    "Hp",
  ]);
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");

  const text = useSelector((state) => state.search.text);
  const dispatch = useDispatch();

  useEffect(() => {
    loadAllProducts();
    getCategories().then((res) => setCategories(res.data));
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  };

  // load products by default on page load
  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(12)
      .then((p) => {
        setProducts(p.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
      });
  };

  // load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
      if (!text) {
        loadAllProducts();
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // load products based on price range
  useEffect(() => {
    if (ok) {
      setLoading(true);
      fetchProducts({ price });
      setLoading(false);
    }
  }, [ok]);

  // load products based on star rating
  useEffect(() => {
    if (star !== null) {
      setLoading(true);
      fetchProducts({ stars: star });
      setLoading(false);
    }
  }, [star]);

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoriesIds([]);
    setStar(null); // Reset star filter
    setPrice(value);
    setBrand("");
    setColor("");
    setShipping("");
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  // show categories in a list of checkboxes
  const handleCheck = (categoryId) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    const isChecked = categoriesIds.includes(categoryId);
    const updatedCategoriesIds = isChecked
      ? categoriesIds.filter((id) => id !== categoryId)
      : [...categoriesIds, categoryId];
    setStar(null);
    setBrand("");
    setColor("");
    setShipping("");
    setCategoriesIds(updatedCategoriesIds);
    fetchProducts({ category: updatedCategoriesIds });
  };

  // show products based on star ratings
  const handleStarClick = (num) => {
    console.log(num);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoriesIds([]);
    setBrand("");
    setColor("");
    setShipping("");
    setStar(num);
    fetchProducts({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} />
    </div>
  );

  const handleBrand = (e) => {
    console.log(e);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoriesIds([]);
    setStar(null);
    setShipping("");
    setColor("");
    setBrand(e.target.value);
    fetchProducts({ brand: e.target.value });
  };

  const handleColor = (e) => {
    console.log(e);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoriesIds([]);
    setStar(null);
    setBrand("");
    setColor(e.target.value);
    setShipping("");
    fetchProducts({ color: e.target.value });
  };

  const handleShippingChange = (e) => {
    console.log(e);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoriesIds([]);
    setStar(null);
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };

  const menuItems = [
    {
      key: "1",
      label: (
        <span className="h6">
          <DollarOutlined /> Price
        </span>
      ),
      children: [
        {
          key: "1-1",
          label: (
            <Slider
              tooltip={{ formatter: (v) => `$ ${v}` }}
              range
              value={price}
              onChange={handleSlider}
              max={4999}
            />
          ),
        },
      ],
    },
    {
      key: "2",
      label: (
        <span className="h6">
          <DownSquareOutlined /> Categories
        </span>
      ),
      children: categories.map((c) => ({
        key: `2-${c._id}`,
        label: (
          <Checkbox
            className="pb-2 pl-4 pr-4"
            onChange={() => handleCheck(c._id)}
            checked={categoriesIds.includes(c._id)}
          >
            {c.name}
          </Checkbox>
        ),
      })),
    },
    {
      key: "3",
      label: (
        <span className="h6">
          <StarOutlined /> Rating
        </span>
      ),
      children: [
        {
          key: "3-1",
          label: showStars(),
        },
      ],
    },
    {
      key: "4",
      label: (
        <span className="h6">
          <DownSquareOutlined /> Brands
        </span>
      ),
      children: brands.map((b, index) => ({
        key: `4-${index}`,
        label: (
          <Radio
            className="pb-2 pl-4 pr-4"
            value={b}
            onChange={handleBrand}
            checked={brand === b}
          >
            {b}
          </Radio>
        ),
      })),
    },
    {
      key: "5",
      label: (
        <span className="h6">
          <DownSquareOutlined /> Colors
        </span>
      ),
      children: colors.map((c, index) => ({
        key: `5-${index}`,
        label: (
          <Radio
            className="pb-2 pl-4 pr-4"
            value={c}
            onChange={handleColor}
            checked={c === color}
          >
            {c}
          </Radio>
        ),
      })),
    },
    {
      key: "6",
      label: (
        <span className="h6">
          <DownSquareOutlined /> Shipping
        </span>
      ),
      children: [
        {
          key: "6-1",
          label: (
            <Checkbox
              className="pb-2 pl-4 pr-4"
              value="Yes"
              onChange={handleShippingChange}
              checked={shipping === "Yes"}
            >
              Yes
            </Checkbox>
          ),
        },
        {
          key: "6-2",
          label: (
            <Checkbox
              className="pb-2 pl-4 pr-4"
              value="No"
              onChange={handleShippingChange}
              checked={shipping === "No"}
            >
              No
            </Checkbox>
          ),
        },
      ],
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />
          <Menu defaultOpenKeys={["1", "3"]} mode="inline" items={menuItems} />
        </div>
        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}
          {products.length < 1 && <p>No Products found</p>}
          <div className="row">
            {products.map((p) => (
              <div key={p._id} className="col">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
