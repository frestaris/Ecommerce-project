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

export const createOrder = async (stripeResponse, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/order`,
    { stripeResponse },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getUserOrders = async (authtoken) => {
  try {
    return await axios.get(`${process.env.REACT_APP_API}/user/orders`, {
      headers: {
        authtoken,
      },
    });
  } catch (error) {
    console.error("Error fetching user orders", error);
    throw error;
  }
};

export const getWishlist = async (authtoken) => {
  try {
    return await axios.get(`${process.env.REACT_APP_API}/user/wishlist`, {
      headers: {
        authtoken,
      },
    });
  } catch (error) {
    console.error("Error fetching user wishlist", error);
    throw error;
  }
};

export const removeWishlist = async (productId, authtoken) => {
  try {
    return await axios.put(
      `${process.env.REACT_APP_API}/user/wishlist/${productId}`,
      {},
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.error("Error removing item from wishlist", error);
    throw error;
  }
};

export const addToWishlist = async (productId, authtoken) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_API}/user/wishlist`,
      { productId },
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.error("Error adding item to wishlist", error);
    throw error;
  }
};

export const createCashOrderForUser = async (authtoken, COD, coupon) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_API}/user/cash-order`,
      { couponApplied: coupon, COD },
      {
        headers: {
          authtoken,
        },
      }
    );
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};
