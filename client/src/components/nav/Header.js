import React, { useState } from "react";
import { Menu } from "antd";
import { toast } from "react-toastify";

import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAuth, signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";

const Header = () => {
  const [current, setCurrent] = useState("home");
  const user = useSelector((state) => state.user);
  const onClick = (e) => {
    setCurrent(e.key);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch({
          type: "LOGOUT",
          payload: null,
        });
        navigate("/login");
        toast.success("You are logged out!");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };
  const username = user ? user.email.split("@")[0] : "";
  const itemsLoggedOut = [
    {
      label: (
        <Link to="/" style={{ textDecoration: "none" }}>
          Home
        </Link>
      ),
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: (
        <Link to="/login" style={{ textDecoration: "none" }}>
          Login
        </Link>
      ),
      key: "login",
      icon: <UserOutlined />,
      className: "ms-auto",
    },
    {
      label: (
        <Link to="/register" style={{ textDecoration: "none" }}>
          Register
        </Link>
      ),
      key: "register",
      icon: <UserAddOutlined />,
    },
  ];

  const itemsLoggedIn = [
    {
      label: (
        <Link to="/" style={{ textDecoration: "none" }}>
          Home
        </Link>
      ),
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: username,
      key: "SubMenu",
      icon: <SettingOutlined />,
      className: "ms-auto",
      children: [
        { label: "Option 1", key: "setting:1" },
        { label: "Option 2", key: "setting:2" },
        {
          label: "Logout",
          key: "logout",
          icon: <LogoutOutlined />,
          onClick: logout,
        },
      ],
    },
  ];

  const items = user ? itemsLoggedIn : itemsLoggedOut;

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Header;
