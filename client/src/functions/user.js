import axios from "axios";

export const userCart = async (cart, authtoken) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_API}/user/cart`,
      { cart },
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.error("Error adding to cart", error);
    throw error;
  }
};

export const getUserCart = async (authtoken) => {
  try {
    return await axios.get(`${process.env.REACT_APP_API}/user/cart`, {
      headers: {
        authtoken,
      },
    });
  } catch (error) {
    console.error("Error fetching user cart", error);
    throw error;
  }
};

export const emptyUserCart = async (authtoken) => {
  try {
    return await axios.delete(`${process.env.REACT_APP_API}/user/cart`, {
      headers: {
        authtoken,
      },
    });
  } catch (error) {
    console.error("Error emptying cart", error);
    throw error;
  }
};

export const saveUserAddress = async (authtoken, address) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_API}/user/address`,
      { address },
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.error("Error finding address", error);
    throw error;
  }
};

export const applyCoupon = async (authtoken, coupon) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_API}/user/cart/coupon`,
      { coupon },
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.error("Error finding coupon", error);
    throw error;
  }
};
