import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Button } from "antd";
import { GoogleOutlined, MailOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { createOrUpdateUser } from "../../functions/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  // redirecting user if logged in

  useEffect(() => {
    let intended = location.state?.from;
    if (intended) {
      return;
    } else {
      if (user && user.token) {
        navigate(user.role === "admin" ? "/admin/dashboard" : "/user/history");
      }
    }
  }, [user, navigate, location]);

  let dispatch = useDispatch();

  const roleBasedRedirect = (res) => {
    let intended = location.state?.from;
    if (intended) {
      navigate(intended.from);
    } else {
      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/history");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      try {
        const res = await createOrUpdateUser(idTokenResult.token);

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
        roleBasedRedirect(res);
        toast.success("Login successful!");
      } catch (err) {
        console.error("Error in createOrUpdateUser:", err);
        toast.error("Failed to create or update user");
      }
    } catch (error) {
      console.error("Error in signInWithEmailAndPassword:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      try {
        const res = await createOrUpdateUser(idTokenResult.token);
        console.log("CREATE OR UPDATE RES", res);

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
        roleBasedRedirect(res);
        toast.success("Login successful!");
      } catch (err) {
        console.error("Error in createOrUpdateUser:", err);
        toast.error("Failed to create or update user");
      }
    } catch (error) {
      console.error("Error logging in with Google: ", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email..."
        autoFocus
      />

      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password..."
        autoFocus
      />

      <Button
        onClick={handleSubmit}
        type="primary"
        className="my-2"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {loginForm()}

          <Button
            onClick={googleLogin}
            type="primary"
            danger
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>

          <Link to="/forgot/password" className="float-right text-danger">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
