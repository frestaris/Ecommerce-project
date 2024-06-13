import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createProduct } from "../../../functions/product";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";

const initialState = {
  title: "",
  description: "",
  price: "",
  categories: [],
  category: "",
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus", "Hp"],
  color: "",
  brand: "",
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);

  // redux

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories()
      .then((c) => setValues({ ...values, categories: c.data }))
      .catch((err) => console.log(err));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, price, quantity, shipping, color, brand } =
      values;
    if (
      !title ||
      !description ||
      !price ||
      !quantity ||
      !shipping ||
      !color ||
      !brand
    ) {
      toast.error("Please fill out all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await createProduct(values, user.token);
      setLoading(false);
      toast.success(`${res.data.title} Created!`);
      setValues(initialState);
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data);
      } else {
        toast.error("Product creation failed");
      }
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [], category: e.target.value });
    getCategorySubs(e.target.value)
      .then((res) => {
        setSubOptions(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load subcategories");
      });
    setShowSub(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h3" />
          ) : (
            <h4>Product Create</h4>
          )}
          <hr />

          <div className="p-2">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
