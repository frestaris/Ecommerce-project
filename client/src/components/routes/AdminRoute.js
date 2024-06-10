import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../../functions/auth";

const AdminRoute = ({ element: Component, ...rest }) => {
  const user = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          console.log("CURRENT ADMIN RES", res);
          setOk(true);
        })
        .catch((err) => {
          console.log("ADMIN ROUTE ERR", err);
          setOk(false);
        });
    }
  }, [user]);

  return ok ? <Component {...rest} /> : <LoadingToRedirect />;
};

export default AdminRoute;
