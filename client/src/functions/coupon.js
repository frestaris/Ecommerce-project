import axios from "axios";

export const getCoupons = async () => {
  try {
    return await axios.get(`${process.env.REACT_APP_API}/coupons`);
  } catch (error) {
    console.error("Error fetching coupons", error);
    throw error;
  }
};

export const removeCoupon = async (couponId, authtoken) => {
  try {
    return await axios.delete(
      `${process.env.REACT_APP_API}/coupon/${couponId}`,
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.error("Error removing coupon", error);
    throw error;
  }
};

export const createCoupon = async (coupon, authtoken) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_API}/coupon`,
      {
        coupon,
      },
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.error("Error removing coupon", error);
    throw error;
  }
};
