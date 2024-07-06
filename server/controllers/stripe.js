const User = require("../models/user");
const Cart = require("../models/cart");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { couponApplied } = req.body;

    // Find user
    const user = await User.findOne({ email: req.user.email }).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User Found:", user);
    // Get cart details for the user
    const cart = await Cart.findOne({ orderedBy: user._id }).exec();
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    console.log("Cart Found:", cart);
    const { cartTotal, totalAfterDiscount } = cart;
    console.log("CART TOTAL", cartTotal, "AFTER DISCOUNT", totalAfterDiscount);

    let finalAmount = 0;

    if (couponApplied && totalAfterDiscount) {
      finalAmount = totalAfterDiscount * 100;
    } else {
      finalAmount = cartTotal * 100;
    }

    // Create payment intent with order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      cartTotal,
      totalAfterDiscount,
      payable: finalAmount,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
