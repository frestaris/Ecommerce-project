import React from "react";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ element: Component, ...rest }) => {
  const user = useSelector((state) => state.user);
  console.log("User in UserRoute component:", user);
  return user && user.token ? <Component {...rest} /> : <LoadingToRedirect />;
};

export default UserRoute;
