import React, { useEffect, useState } from "react";
import UserNav from "../../components/nav/UserNav";
import { getWishlist, removeWishlist } from "../../functions/user";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const res = await getWishlist(user.token);
      setWishlist(res.data.wishlist);
    } catch (error) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };
  const handleRemove = async (productId) => {
    try {
      await removeWishlist(productId, user.token);
      toast.success("Item removed from wishlist");
      loadWishlist();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>
          {wishlist.map((p) => (
            <div
              key={p._id}
              className="alert alert-secondary d-flex align-items-center justify-content-between"
            >
              <Link to={`/product/${p.slug}`} className="text-decoration-none">
                {p.title}
              </Link>
              <span onClick={() => handleRemove(p._id)} className="btn btn-sm">
                <DeleteOutlined className="text-danger" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
