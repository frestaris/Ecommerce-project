import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import SideDrawer from "./components/drawer/SideDrawer";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Header from "./components/nav/Header";
import RegisterComplete from "./pages/auth/RegisterComplete";
import ForgotPassword from "./pages/auth/ForgotPassword";
import History from "./pages/user/History";
import UserRoute from "./components/routes/UserRoute";
import AdminRoute from "./components/routes/AdminRoute";
import Password from "./pages/user/Password";
import Wishlist from "./pages/user/Wishlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryCreate from "./pages/admin/category/CategoryCreate";
import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
import SubCreate from "./pages/admin/sub/SubCreate";
import SubUpdate from "./pages/admin/sub/SubUpdate";
import ProductCreate from "./pages/admin/product/ProductCreate";
import AllProducts from "./pages/admin/product/AllProducts";
import ProductUpdate from "./pages/admin/product/ProductUpdate";
import Product from "./pages/Product";
import CategoryHome from "./pages/category/CategoryHome";
import SubHome from "./pages/sub/SubHome";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";

import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "./functions/auth";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        try {
          const res = await currentUser(idTokenResult.token);

          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: res.data.name,
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });
        } catch (err) {
          console.error("Error in createOrUpdateUser:", err);
          toast.error("Failed to create or update user");
        }
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  return (
    <>
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/register/complete" element={<RegisterComplete />} />
        <Route exact path="/forgot/password" element={<ForgotPassword />} />
        <Route
          exact
          path="/user/history"
          element={<UserRoute element={History} />}
        />
        <Route
          exact
          path="/user/password"
          element={<UserRoute element={Password} />}
        />
        <Route
          exact
          path="/user/wishlist"
          element={<UserRoute element={Wishlist} />}
        />
        <Route
          exact
          path="/admin/dashboard"
          element={<AdminRoute element={AdminDashboard} />}
        />
        <Route
          exact
          path="/admin/category"
          element={<AdminRoute element={CategoryCreate} />}
        />
        <Route
          exact
          path="/admin/category/:slug"
          element={<AdminRoute element={CategoryUpdate} />}
        />
        <Route
          exact
          path="/admin/sub"
          element={<AdminRoute element={SubCreate} />}
        />
        <Route
          exact
          path="/admin/sub/:slug"
          element={<AdminRoute element={SubUpdate} />}
        />
        <Route
          exact
          path="/admin/product"
          element={<AdminRoute element={ProductCreate} />}
        />
        <Route
          exact
          path="/admin/products"
          element={<AdminRoute element={AllProducts} />}
        />
        <Route
          exact
          path="/admin/product/:slug"
          element={<AdminRoute element={ProductUpdate} />}
        />
        <Route exact path="/product/:slug" element={<Product />} />
        <Route exact path="/category/:slug" element={<CategoryHome />} />
        <Route exact path="/sub/:slug" element={<SubHome />} />
        <Route exact path="/shop" element={<Shop />} />
        <Route exact path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
};

export default App;
