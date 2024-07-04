import { createSelector } from "reselect";

const selectDrawer = (state) => state.drawer;
const selectCart = (state) => state.cart;

export const selectDrawerAndCart = createSelector(
  [selectDrawer, selectCart],
  (drawer, cart) => ({ drawer, cart })
);

const selectUser = (state) => state.user;

export const selectUserAndCart = createSelector(
  [selectUser, selectCart],
  (user, cart) => ({ user, cart })
);

const selectCoupon = (state) => state.coupon;

export const selectUserAndCoupon = createSelector(
  [selectUser, selectCoupon],
  (user, coupon) => ({ user, coupon })
);
