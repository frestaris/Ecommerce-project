import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "./functions/auth";
import { LoadingOutlined } from "@ant-design/icons";

const SideDrawer = lazy(() => import("./components/drawer/SideDrawer"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Home = lazy(() => import("./pages/Home"));
const Header = lazy(() => import("./components/nav/Header"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const History = lazy(() => import("./pages/user/History"));
const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));
const Password = lazy(() => import("./pages/user/Password"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate")
);
const CategoryUpdate = lazy(() =>
  import("./pages/admin/category/CategoryUpdate")
);
const SubCreate = lazy(() => import("./pages/admin/sub/SubCreate"));
const SubUpdate = lazy(() => import("./pages/admin/sub/SubUpdate"));
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const Product = lazy(() => import("./pages/Product"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubHome = lazy(() => import("./pages/sub/SubHome"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CreateCouponPage = lazy(() =>
  import("./pages/admin/coupon/CreateCouponPage")
);
const Payment = lazy(() => import("./pages/Payment"));

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
    <Suspense
      fallback={
        <div className="col text-center p-5">
          __ React Redux EC <LoadingOutlined /> MMERCE
        </div>
      }
    >
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
        <Route exact path="/checkout" element={<Checkout />} />
        <Route
          exact
          path="/admin/coupon"
          element={<AdminRoute element={CreateCouponPage} />}
        />
        <Route
          exact
          path="/payment"
          element={<UserRoute element={Payment} />}
        />
      </Routes>
    </Suspense>
  );
};

export default App;
