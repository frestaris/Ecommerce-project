import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from "../../../functions/coupon";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";

const CreateCouponPage = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState("");
  const [coupons, setCoupons] = useState([]);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadAllCoupons();
  }, []);

  const loadAllCoupons = () => getCoupons().then((res) => setCoupons(res.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createCoupon({ name, expiry, discount }, user.token);
      setLoading(false);
      loadAllCoupons();
      setName("");
      setDiscount("");
      setExpiry("");
      toast.success(`${res.data.name} Created!`);
    } catch (error) {
      console.error("Coupon creation error:", error);
      setLoading(false);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data);
      } else {
        toast.error("Coupon creation failed");
      }
    }
  };

  const handleRemove = async (couponId) => {
    const coupon = coupons.find((c) => c._id === couponId);
    if (window.confirm(`Delete "${coupon.name}"?`)) {
      setLoading(true);
      try {
        await removeCoupon(couponId, user.token);
        const res = await getCoupons();
        setCoupons(res.data);
        setLoading(false);
        loadAllCoupons();
        toast.success(`Coupon "${coupon.name}" deleted successfully`);
      } catch (error) {
        console.error("Coupon removal error:", error);
        setLoading(false);
        toast.error("Coupon removal failed");
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Create Coupon</h4>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group py-2">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
                minLength={6}
              />
            </div>
            <div className="form-group py-2">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              />
            </div>
            <div className="form-group py-2">
              <label className="text-muted">Expiry</label>
              <br />
              <DatePicker
                className="form-control"
                selected={expiry}
                onChange={(date) => setExpiry(date)}
                required
              />
            </div>
            <button className="btn btn-outline-primary">Save</button>
          </form>
          <br />
          <h4>{coupons.length} Coupons</h4>
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount} %</td>
                  <td>
                    <DeleteOutlined
                      onClick={() => handleRemove(c._id)}
                      className="text-danger pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
