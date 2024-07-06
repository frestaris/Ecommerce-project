import { createSelector } from "reselect";

const selectDrawer = (state) => state.drawer;
const selectCart = (state) => state.cart;
const selectCoupon = (state) => state.coupon;
const selectUser = (state) => state.user;

export const selectDrawerAndCart = createSelector(
  [selectDrawer, selectCart],
  (drawer, cart) => ({ drawer, cart })
);

export const selectUserAndCart = createSelector(
  [selectUser, selectCart],
  (user, cart) => ({ user, cart })
);

export const selectUserAndCoupon = createSelector(
  [selectUser, selectCoupon],
  (user, coupon) => ({ user, coupon })
);
