import React, { useState, useEffect } from "react";
import AdminNav from "../../components/nav/AdminNav";
import { getOrders, changeStatus } from "../../functions/admin";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Orders from "../../components/order/Orders";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders(user.token);
      setOrders(res.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      const res = await changeStatus(orderId, orderStatus, user.token);
      toast.success("Status updated");
      loadUserOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>Admin Dashboard</h4>
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
