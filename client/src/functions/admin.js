import axios from "axios";

export const getOrders = async (authtoken) => {
  try {
    return await axios.get(`${process.env.REACT_APP_API}/admin/orders`, {
      headers: {
        authtoken,
      },
    });
  } catch (error) {
    console.error("Error fetching admin orders", error);
    throw error;
  }
};

export const changeStatus = async (orderId, orderStatus, authtoken) => {
  try {
    return await axios.put(
      `${process.env.REACT_APP_API}/admin/order-status`,
      { orderId, orderStatus },
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching admin orders", error);
    throw error;
  }
};
