import React, { useState } from "react";
import { Modal, Button } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const RatingModal = ({ children }) => {
  const user = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleModal = () => {
    if (user && user.token) {
      setModalVisible(true);
    } else {
      navigate({
        pathname: "/login",
        state: { from: `/product/${slug}` },
      });
    }
  };

  return (
    <div>
      <div onClick={handleModal} style={{ cursor: "pointer" }}>
        <StarOutlined className="text-danger" />
        <br />
        {user ? "Leave rating" : "Login to leave rating"}
      </div>
      <Modal
        title={
          <div>
            Leave your rating
            <hr />
          </div>
        }
        centered
        open={modalVisible}
        onOk={() => {
          setModalVisible(false);
          toast.success("Thanks for your review. It will appear soon!");
        }}
        onCancel={() => setModalVisible(false)}
      >
        {children}
        <hr />
      </Modal>
    </div>
  );
};

export default RatingModal;
