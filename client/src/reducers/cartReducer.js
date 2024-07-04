const initialState =
  typeof window !== "undefined" && localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

export const cartReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return [...action.payload]; // Returning a new array
    default:
      return state;
  }
};
