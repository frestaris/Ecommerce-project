const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const uniqueid = require("uniqueid");

exports.userCart = async (req, res) => {
  const { cart } = req.body;
  const user = await User.findOne({ email: req.user.email }).exec();

  // Find existing cart by user ID
  let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec();

  if (cartExistByThisUser) {
    // Update existing cart
    cartExistByThisUser.products = cart.map((item) => ({
      product: item._id,
      count: item.count,
      color: item.color,
      price: item.price, // Assuming price is stored in cart item
    }));
    cartExistByThisUser.cartTotal = calculateCartTotal(cart); // Implement calculateCartTotal function
    await cartExistByThisUser.save();
    console.log("Updated existing cart:", cartExistByThisUser);
    return res.json({ ok: true });
  } else {
    // Create new cart
    let products = [];
    for (let i = 0; i < cart.length; i++) {
      let { price } = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
      products.push({
        product: cart[i]._id,
        count: cart[i].count,
        color: cart[i].color,
        price: price,
      });
    }

    let cartTotal = calculateCartTotal(cart); // Implement calculateCartTotal function

    let newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user._id,
    }).save();

    console.log("Created new cart:", newCart);
    return res.json({ ok: true });
  }
};

// Function to calculate cart total
const calculateCartTotal = (cart) => {
  let cartTotal = 0;
  for (let item of cart) {
    cartTotal += item.price * item.count;
  }
  return cartTotal;
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  if (!cart) {
    return res.json({ products: [], cartTotal: 0, totalAfterDiscount: 0 });
  }

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const cart = await Cart.findOneAndDelete({ orderedBy: user._id }).exec();
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.json({ message: "Cart emptied successfully" });
  } catch (error) {
    console.error("Error emptying cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.saveAddress = async (req, res) => {
  try {
    const userAddress = await User.findOneAndUpdate(
      {
        email: req.user.email,
      },
      {
        address: req.body.address,
      }
    ).exec();
    res.json({ ok: true });
    if (!userAddress) {
      return res.status(400).json({ error: "User address not found" });
    }
  } catch (error) {
    console.error("Error finding Address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.applyCouponToUserCart = async (req, res) => {
  try {
    const { coupon } = req.body;
    console.log("COUPON", coupon);

    // Find if the coupon exists
    const validCoupon = await Coupon.findOne({ name: coupon }).exec();
    if (validCoupon === null) {
      return res.status(400).json({ error: "Coupon not found" });
    }

    // Get the user based on email
    const user = await User.findOne({ email: req.user.email }).exec();

    // Get user's cart details
    let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
      .populate("products.product", "_id title price")
      .exec();

    // Calculate the discount
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    // Update cart with discounted total
    await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      { totalAfterDiscount },
      { new: true }
    ).exec();

    res.json({ totalAfterDiscount });
  } catch (error) {
    console.error("Error finding Coupon:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { paymentIntent } = req.body.stripeResponse;
    if (!paymentIntent) {
      return res.status(400).json({ error: "Payment intent is required" });
    }

    // Find the user
    const user = await User.findOne({ email: req.user.email }).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ orderedBy: user._id }).exec();
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const { products } = cart;

    // Create a new order
    const newOrder = await new Order({
      products,
      paymentIntent,
      orderedBy: user._id,
    }).save();

    // Update product quantities and sales
    let bulkOption = products.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    }));

    let updated = await Product.bulkWrite(bulkOption, {});
    console.log("PRODUCT QUANTITY DECREMENTED AND SOLD", updated);

    console.log("NEW ORDER SAVED", newOrder);

    // Respond with success message and order details
    res.json({ ok: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.orders = async (req, res) => {
  try {
    let user = await User.findOne({
      email: req.user.email,
    }).exec();

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    let userOrders = await Order.find({ orderedBy: user._id })
      .populate("products.product")
      .exec();

    res.json(userOrders);
  } catch (error) {
    console.error("Error finding User:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();

  res.json(list);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.createCashOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;

  try {
    if (!COD) {
      return res.status(400).send("Create cash order failed");
    }

    const user = await User.findOne({ email: req.user.email }).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let userCart = await Cart.findOne({ orderedBy: user._id }).exec();
    if (!userCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    let finalAmount = 0;

    // Example logic for applying coupon (assuming couponApplied is defined)
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount * 100;
    } else {
      finalAmount = userCart.cartTotal * 100;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqueid(),
        amount: finalAmount,
        currency: "aud",
        status: "Cash On Delivery",
        created: Date.now(),
        payment_method_types: ["cash"],
      },
      orderedBy: user._id,
      orderStatus: "Cash On Delivery", // Assuming you want to set status here
    }).save();

    // Update product quantities and sales
    let bulkOption = userCart.products.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    }));

    let updated = await Product.bulkWrite(bulkOption, {});
    console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

    console.log("NEW ORDER SAVED", newOrder);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error creating cash order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
