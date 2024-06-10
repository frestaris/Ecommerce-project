import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/category";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const CategoryCreate = () => {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createCategory({ name }, user.token);
      setLoading(false);
      setName("");
      toast.success(`${res.data.name} Created!`);
      loadCategories();
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data);
      } else {
        toast.error("Category creation failed");
      }
    }
  };

  const handleRemove = async (slug) => {
    if (window.confirm("Are you sure you want to delete?")) {
      setLoading(true);
      try {
        await removeCategory(slug, user.token);
        toast.success("Category deleted successfully");
        loadCategories();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Category deletion failed");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Create category</h4>
          )}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />
          <hr />
          {categories.filter(searched(keyword)).map((c) => (
            <div className="alert alert-primary" key={c._id}>
              {c.name}
              <span
                onClick={() => handleRemove(c.slug)}
                className="btn btn-sm text-danger float-end"
              >
                <DeleteOutlined />
              </span>
              <Link to={`/admin/category/${c.slug}`}>
                <span className="btn btn-sm text-warning float-end">
                  <EditOutlined />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
